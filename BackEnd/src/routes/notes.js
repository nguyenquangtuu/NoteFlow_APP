const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { authMiddleware } = require("../middleware/auth");
const { query } = require("../config/db");
const { mapNote } = require("../utils/note-mapper");
const { createOpaqueToken } = require("../utils/tokens");

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.resolve(process.cwd(), "uploads")),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
});

async function syncNoteLabels(noteId, labelIds = []) {
  await query("DELETE FROM note_labels WHERE note_id = ?", [noteId]);
  for (const labelId of labelIds) {
    await query("INSERT INTO note_labels (note_id, label_id) VALUES (?, ?)", [noteId, labelId]);
  }
}

async function getNotes(userId, userEmail, filters = {}) {
  const conditions = [];
  const params = [];

  if (filters.includeShared) {
    conditions.push("(n.user_id = ? OR EXISTS (SELECT 1 FROM note_shares ns WHERE ns.note_id = n.id AND ns.shared_with_email = ?))");
    params.push(userId, userEmail);
  } else if (filters.sharedWithMe) {
    conditions.push("EXISTS (SELECT 1 FROM note_shares ns WHERE ns.note_id = n.id AND ns.shared_with_email = ?)");
    params.push(userEmail);
    conditions.push("n.is_deleted = 0");
  } else {
    conditions.push("n.user_id = ?");
    params.push(userId);
  }
  
  if (filters.includeDeleted !== "all") {
    conditions.push("n.is_deleted = ?");
    params.push(filters.includeDeleted ? 1 : 0);
  }

  if (filters.date) {
    conditions.push("n.note_date = ?");
    params.push(filters.date);
  }

  if (filters.search) {
    conditions.push("(n.title LIKE ? OR n.content LIKE ?)");
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters.labelId) {
    conditions.push("EXISTS (SELECT 1 FROM note_labels x WHERE x.note_id = n.id AND x.label_id = ?)");
    params.push(filters.labelId);
  }

  const rows = await query(
    `SELECT n.*,
            IF(n.user_id = ?, 0, 1) AS is_shared_with_me,
            (SELECT permission FROM note_shares ns WHERE ns.note_id = n.id AND ns.shared_with_email = ? LIMIT 1) AS shared_permission,
            COALESCE(
              JSON_ARRAYAGG(
                CASE WHEN l.id IS NOT NULL THEN JSON_OBJECT('id', l.id, 'name', l.name, 'color', l.color) END
              ),
              JSON_ARRAY()
            ) AS labels
     FROM notes n
     LEFT JOIN note_labels nl ON nl.note_id = n.id
     LEFT JOIN labels l ON l.id = nl.label_id
     WHERE ${conditions.join(" AND ")}
     GROUP BY n.id
     ORDER BY n.is_pinned DESC, n.note_date DESC, n.updated_at DESC`,
    [userId, userEmail, ...params],
  );

  return rows.map((row) => {
    if (row.labels === "[null]") {
      row.labels = "[]";
    }
    const note = mapNote(row);
    note.isSharedWithMe = Boolean(row.is_shared_with_me);
    if (row.shared_permission) {
      note.sharedPermission = row.shared_permission;
    }
    return note;
  });
}

router.get("/shared/:token", async (req, res) => {
  const rows = await query(
    `SELECT n.*, JSON_ARRAY() AS labels
     FROM notes n
     WHERE n.share_token = ? LIMIT 1`,
    [req.params.token],
  );
  if (!rows.length) {
    return res.status(404).json({ message: "Liên kết chia sẻ không tồn tại." });
  }
  if (rows[0].public_permission === 'none') {
    return res.status(403).json({ message: "Ghi chú này không còn được chia sẻ công khai." });
  }
  return res.json({ note: mapNote(rows[0]), permission: rows[0].public_permission });
});

router.put("/shared/:token", async (req, res) => {
  const { title, content } = req.body;
  const rows = await query(
    `SELECT n.id, n.public_permission, n.user_id 
     FROM notes n 
     WHERE n.share_token = ? LIMIT 1`,
    [req.params.token]
  );
  if (!rows.length) return res.status(404).json({ message: "Liên kết chia sẻ không tồn tại." });
  
  if (rows[0].public_permission !== 'editor') {
    return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa ghi chú này." });
  }

  await query(
    `UPDATE notes SET title = ?, content = ? WHERE id = ?`,
    [title ?? "Ghi chú mới", content ?? "", rows[0].id]
  );

  const io = req.app.get('io');
  if (io) {
    const updatedRows = await query(`SELECT n.*, JSON_ARRAY() AS labels FROM notes n WHERE n.id = ?`, [rows[0].id]);
    if (updatedRows.length > 0) {
      const updatedNote = mapNote(updatedRows[0]);
      const sharedUsers = await query("SELECT u.id FROM note_shares ns JOIN users u ON u.email = ns.shared_with_email WHERE ns.note_id = ?", [rows[0].id]);
      const targetUsers = new Set([rows[0].user_id, ...sharedUsers.map(u => u.id)]);
      
      for (const uId of targetUsers) {
        io.to(`user_${uId}`).emit('note_updated', { note: updatedNote, updatedBy: 'public_guest' });
      }
    }
  }

  return res.json({ message: "Đã cập nhật." });
});

router.use(authMiddleware);

router.post("/shared/:token/join", async (req, res) => {
  const rows = await query(
    `SELECT n.id, n.public_permission, n.user_id 
     FROM notes n 
     WHERE n.share_token = ? LIMIT 1`,
    [req.params.token]
  );
  if (!rows.length) return res.status(404).json({ message: "Liên kết chia sẻ không tồn tại." });
  if (rows[0].public_permission === 'none') return res.status(403).json({ message: "Ghi chú này không còn được chia sẻ công khai." });
  
  if (rows[0].user_id === req.user.id) {
    return res.json({ message: "Đây là ghi chú của bạn.", noteId: rows[0].id });
  }

  const existing = await query("SELECT id, permission FROM note_shares WHERE note_id = ? AND shared_with_email = ?", [rows[0].id, req.user.email]);
  if (!existing.length) {
    const { v4: uuidv4 } = require("uuid");
    await query("INSERT INTO note_shares (id, note_id, shared_with_email, permission) VALUES (?, ?, ?, ?)", [uuidv4(), rows[0].id, req.user.email, rows[0].public_permission]);
  } else if (existing[0].permission === 'viewer' && rows[0].public_permission === 'editor') {
    await query("UPDATE note_shares SET permission = 'editor' WHERE id = ?", [existing[0].id]);
  }

  return res.json({ message: "Đã thêm vào danh sách chia sẻ.", noteId: rows[0].id });
});

router.get("/", async (req, res) => {
  const view = req.query.view;
  const includeDeleted = view === "all" ? "all" : (view === "trash" ? 1 : 0);
  
  const notes = await getNotes(req.user.id, req.user.email, {
    date: req.query.date,
    search: req.query.search,
    labelId: req.query.labelId,
    includeDeleted: includeDeleted,
    includeShared: view === "all",
    sharedWithMe: view === "shared"
  });
  return res.json({ notes });
});

router.get("/calendar", async (req, res) => {
  const month = req.query.month;
  const rows = await query(
    `SELECT note_date AS date, COUNT(*) AS total
     FROM notes
     WHERE user_id = ? AND is_deleted = 0 AND DATE_FORMAT(note_date, '%Y-%m') = ?
     GROUP BY note_date
     ORDER BY note_date ASC`,
    [req.user.id, month],
  );
  return res.json({ days: rows });
});

router.post("/", async (req, res) => {
  const {
    title,
    content,
    noteDate,
    labelIds,
    isPinned,
    notePassword,
    images = [],
  } = req.body;

  const id = req.body.id || uuidv4();
  const notePasswordHash = notePassword ? await bcrypt.hash(notePassword, 10) : null;
  await query(
    `INSERT INTO notes
      (id, user_id, title, content, note_date, is_pinned, is_password_protected, note_password_hash, images, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      req.user.id,
      title || "Ghi chú mới",
      content || "",
      noteDate,
      isPinned ? 1 : 0,
      notePassword ? 1 : 0,
      notePasswordHash,
      JSON.stringify(images),
      req.user.full_name,
    ],
  );

  await syncNoteLabels(id, labelIds);
  const notes = await getNotes(req.user.id, req.user.email, {});
  return res.status(201).json({ message: "Đã tạo ghi chú mới.", note: notes.find((item) => item.id === id) });
});

router.put("/:id", async (req, res) => {
  const {
    title,
    content,
    noteDate,
    labelIds,
    isPinned,
    isDeleted,
    notePassword,
    clearPassword,
    images,
  } = req.body;

  const currentRows = await query(
    `SELECT n.* 
     FROM notes n 
     WHERE n.id = ? AND (n.user_id = ? OR EXISTS (SELECT 1 FROM note_shares ns WHERE ns.note_id = n.id AND ns.shared_with_email = ? AND ns.permission = 'editor')) LIMIT 1`, 
    [req.params.id, req.user.id, req.user.email]
  );
  if (!currentRows.length) {
    return res.status(404).json({ message: "Không tìm thấy ghi chú." });
  }

  let notePasswordHash = currentRows[0].note_password_hash;
  let isPasswordProtected = currentRows[0].is_password_protected;

  if (notePassword) {
    notePasswordHash = await bcrypt.hash(notePassword, 10);
    isPasswordProtected = 1;
  }

  if (clearPassword) {
    notePasswordHash = null;
    isPasswordProtected = 0;
  }

  await query(
    `UPDATE notes
     SET title = ?, content = ?, note_date = ?, is_pinned = ?, is_deleted = ?,
         is_password_protected = ?, note_password_hash = ?, images = ?, updated_by = ?
     WHERE id = ?`,
    [
      title ?? currentRows[0].title,
      content ?? currentRows[0].content,
      noteDate ?? currentRows[0].note_date,
      isPinned === undefined ? currentRows[0].is_pinned : isPinned ? 1 : 0,
      isDeleted === undefined ? currentRows[0].is_deleted : isDeleted ? 1 : 0,
      isPasswordProtected,
      notePasswordHash,
      JSON.stringify(images ?? (currentRows[0].images ? JSON.parse(currentRows[0].images) : [])),
      req.user.full_name,
      req.params.id,
    ],
  );

  if (Array.isArray(labelIds)) {
    await syncNoteLabels(req.params.id, labelIds);
  }

  const notes = await getNotes(req.user.id, req.user.email, { includeDeleted: Boolean(isDeleted) });
  const updatedNote = notes.find((item) => item.id === req.params.id);
  
  const io = req.app.get('io');
  if (io && updatedNote) {
    const sharedUsers = await query("SELECT u.id FROM note_shares ns JOIN users u ON u.email = ns.shared_with_email WHERE ns.note_id = ?", [req.params.id]);
    
    // Emit to the person who updated it (so their other tabs sync), plus everyone else
    const targetUsers = new Set([currentRows[0].user_id, ...sharedUsers.map(u => u.id)]);
    
    for (const uId of targetUsers) {
      io.to(`user_${uId}`).emit('note_updated', { note: updatedNote, updatedBy: req.user.id });
    }
  }

  return res.json({ message: "Ghi chú đã được cập nhật.", note: updatedNote });
});

router.delete("/:id", async (req, res) => {
  await query("UPDATE notes SET is_deleted = 1 WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
  return res.json({ message: "Ghi chú đã được chuyển vào thùng rác." });
});

router.delete("/:id/permanent", async (req, res) => {
  await query("DELETE FROM notes WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
  return res.json({ message: "Ghi chú đã bị xóa vĩnh viễn." });
});

router.post("/:id/share", async (req, res) => {
  const shareToken = createOpaqueToken();
  await query("UPDATE notes SET share_token = ?, public_permission = 'viewer' WHERE id = ? AND user_id = ?", [
    shareToken,
    req.params.id,
    req.user.id,
  ]);
  return res.json({
    message: "Đã tạo liên kết chia sẻ.",
    shareUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/chia-se/${shareToken}`,
  });
});

router.get("/:id/shares", async (req, res) => {
  const notes = await query("SELECT public_permission, share_token FROM notes WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
  if (!notes.length) return res.status(404).json({ message: "Không tìm thấy ghi chú." });
  
  const shares = await query("SELECT shared_with_email as email, permission FROM note_shares WHERE note_id = ?", [req.params.id]);
  return res.json({ publicPermission: notes[0].public_permission, shareToken: notes[0].share_token, shares });
});

router.put("/:id/shares/public", async (req, res) => {
  const { permission } = req.body;
  if (!['none', 'viewer', 'editor'].includes(permission)) return res.status(400).json({ message: "Quyền không hợp lệ." });
  
  await query("UPDATE notes SET public_permission = ? WHERE id = ? AND user_id = ?", [permission, req.params.id, req.user.id]);
  return res.json({ message: "Đã cập nhật quyền truy cập công khai." });
});

router.post("/:id/shares/user", async (req, res) => {
  const { email, permission } = req.body;
  if (!['viewer', 'editor'].includes(permission)) return res.status(400).json({ message: "Quyền không hợp lệ." });
  if (email === req.user.email) return res.status(400).json({ message: "Không thể tự chia sẻ cho chính mình." });

  const existing = await query("SELECT id FROM note_shares WHERE note_id = ? AND shared_with_email = ?", [req.params.id, email]);
  if (existing.length) {
    await query("UPDATE note_shares SET permission = ? WHERE id = ?", [permission, existing[0].id]);
  } else {
    const { v4: uuidv4 } = require("uuid");
    await query("INSERT INTO note_shares (id, note_id, shared_with_email, permission) VALUES (?, ?, ?, ?)", [uuidv4(), req.params.id, email, permission]);
  }
  return res.json({ message: "Đã chia sẻ ghi chú thành công." });
});

router.delete("/:id/shares/user/:email", async (req, res) => {
  await query("DELETE FROM note_shares WHERE note_id = ? AND shared_with_email = ?", [req.params.id, req.params.email]);
  return res.json({ message: "Đã xóa người dùng khỏi danh sách chia sẻ." });
});

router.post("/:id/images", upload.single("image"), async (req, res) => {
  const rows = await query("SELECT images FROM notes WHERE id = ? AND user_id = ? LIMIT 1", [
    req.params.id,
    req.user.id,
  ]);
  if (!rows.length) {
    return res.status(404).json({ message: "Không tìm thấy ghi chú." });
  }

  const existingImages = rows[0].images ? JSON.parse(rows[0].images) : [];
  const imagePath = `/uploads/${req.file.filename}`;
  existingImages.push(imagePath);
  await query("UPDATE notes SET images = ? WHERE id = ? AND user_id = ?", [
    JSON.stringify(existingImages),
    req.params.id,
    req.user.id,
  ]);
  return res.json({ message: "Đã tải ảnh lên ghi chú.", images: existingImages });
});

module.exports = router;
