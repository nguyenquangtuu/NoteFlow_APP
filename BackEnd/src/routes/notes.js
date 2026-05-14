const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
<<<<<<< HEAD
const dayjs = require("dayjs");
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
const { v4: uuidv4 } = require("uuid");
const { authMiddleware } = require("../middleware/auth");
const { query } = require("../config/db");
const { mapNote } = require("../utils/note-mapper");
const { createOpaqueToken } = require("../utils/tokens");
<<<<<<< HEAD
const { sendPushNotification } = require("../utils/notifications");

const router = express.Router();

=======

const router = express.Router();
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.resolve(process.cwd(), "uploads")),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
});

async function syncNoteLabels(noteId, labelIds = []) {
  await query("DELETE FROM note_labels WHERE note_id = ?", [noteId]);
<<<<<<< HEAD
  for (const labelId of labelIds || []) {
=======
  for (const labelId of labelIds) {
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
    await query("INSERT INTO note_labels (note_id, label_id) VALUES (?, ?)", [noteId, labelId]);
  }
}

<<<<<<< HEAD
async function getNoteById(noteId) {
  const rows = await query(
    `SELECT n.*,
            COALESCE(
              JSON_ARRAYAGG(
                CASE WHEN l.id IS NOT NULL THEN JSON_OBJECT('id', l.id, 'name', l.name, 'color', l.color) END
              ),
              JSON_ARRAY()
            ) AS labels
     FROM notes n
     LEFT JOIN note_labels nl ON nl.note_id = n.id
     LEFT JOIN labels l ON l.id = nl.label_id
     WHERE n.id = ?
     GROUP BY n.id`,
    [noteId],
  );
  if (!rows.length) return null;
  if (rows[0].labels === "[null]") rows[0].labels = "[]";
  return mapNote(rows[0]);
}

async function verifyProtectedAccess(noteRow, password) {
  if (!noteRow.is_password_protected) return true;
  if (!password) return false;
  return bcrypt.compare(password, noteRow.note_password_hash || "");
}

=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
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
<<<<<<< HEAD

=======
  
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
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
<<<<<<< HEAD
            (SELECT created_at FROM note_shares ns WHERE ns.note_id = n.id AND ns.shared_with_email = ? LIMIT 1) AS shared_at,
            owner.full_name AS owner_name,
            owner.email AS owner_email,
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
            COALESCE(
              JSON_ARRAYAGG(
                CASE WHEN l.id IS NOT NULL THEN JSON_OBJECT('id', l.id, 'name', l.name, 'color', l.color) END
              ),
              JSON_ARRAY()
            ) AS labels
     FROM notes n
<<<<<<< HEAD
     JOIN users owner ON owner.id = n.user_id
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
     LEFT JOIN note_labels nl ON nl.note_id = n.id
     LEFT JOIN labels l ON l.id = nl.label_id
     WHERE ${conditions.join(" AND ")}
     GROUP BY n.id
<<<<<<< HEAD
     ORDER BY n.is_pinned DESC, n.pinned_at DESC, n.updated_at DESC`,
    [userId, userEmail, userEmail, ...params],
  );

  return rows.map((row) => {
    if (row.labels === "[null]") row.labels = "[]";
    const note = mapNote(row);
    note.isSharedWithMe = Boolean(row.is_shared_with_me);
    if (row.shared_permission) note.sharedPermission = row.shared_permission;
    if (row.shared_at) note.sharedAt = row.shared_at;
    note.ownerName = row.owner_name;
    note.ownerEmail = row.owner_email;
=======
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
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
    return note;
  });
}

router.get("/shared/:token", async (req, res) => {
  const rows = await query(
<<<<<<< HEAD
    `SELECT n.*, u.full_name AS owner_name, u.email AS owner_email, JSON_ARRAY() AS labels
     FROM notes n
     JOIN users u ON u.id = n.user_id
     WHERE n.share_token = ? LIMIT 1`,
    [req.params.token],
  );

  if (!rows.length) {
    return res.status(404).json({ message: "Liên kết chia sẻ không tồn tại." });
  }
  if (rows[0].public_permission === "none") {
    return res.status(403).json({ message: "Ghi chú này không còn được chia sẻ công khai." });
  }

  const note = mapNote(rows[0]);
  note.ownerName = rows[0].owner_name;
  note.ownerEmail = rows[0].owner_email;
  return res.json({ note, permission: rows[0].public_permission });
=======
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
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
});

router.put("/shared/:token", async (req, res) => {
  const { title, content } = req.body;
  const rows = await query(
<<<<<<< HEAD
    `SELECT n.id, n.public_permission, n.user_id
     FROM notes n
     WHERE n.share_token = ? LIMIT 1`,
    [req.params.token],
  );

  if (!rows.length) return res.status(404).json({ message: "Liên kết chia sẻ không tồn tại." });
  if (rows[0].public_permission !== "editor") {
    return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa ghi chú này." });
  }

  await query("UPDATE notes SET title = ?, content = ? WHERE id = ?", [title ?? "Ghi chú mới", content ?? "", rows[0].id]);

  const io = req.app.get("io");
  const updatedNote = await getNoteById(rows[0].id);
  if (io && updatedNote) {
    const sharedUsers = await query(
      "SELECT u.id FROM note_shares ns JOIN users u ON u.email = ns.shared_with_email WHERE ns.note_id = ?",
      [rows[0].id],
    );
    const targetUsers = new Set([rows[0].user_id, ...sharedUsers.map((u) => u.id)]);
    for (const uId of targetUsers) {
      io.to(`user_${uId}`).emit("note_updated", { note: updatedNote, updatedBy: "public_guest" });
=======
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
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
    }
  }

  return res.json({ message: "Đã cập nhật." });
});

router.use(authMiddleware);

router.post("/shared/:token/join", async (req, res) => {
  const rows = await query(
<<<<<<< HEAD
    `SELECT n.id, n.public_permission, n.user_id
     FROM notes n
     WHERE n.share_token = ? LIMIT 1`,
    [req.params.token],
  );

  if (!rows.length) return res.status(404).json({ message: "Liên kết chia sẻ không tồn tại." });
  if (rows[0].public_permission === "none") return res.status(403).json({ message: "Ghi chú này không còn được chia sẻ công khai." });

=======
    `SELECT n.id, n.public_permission, n.user_id 
     FROM notes n 
     WHERE n.share_token = ? LIMIT 1`,
    [req.params.token]
  );
  if (!rows.length) return res.status(404).json({ message: "Liên kết chia sẻ không tồn tại." });
  if (rows[0].public_permission === 'none') return res.status(403).json({ message: "Ghi chú này không còn được chia sẻ công khai." });
  
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  if (rows[0].user_id === req.user.id) {
    return res.json({ message: "Đây là ghi chú của bạn.", noteId: rows[0].id });
  }

<<<<<<< HEAD
  const existing = await query(
    "SELECT id, permission FROM note_shares WHERE note_id = ? AND shared_with_email = ?",
    [rows[0].id, req.user.email],
  );

  if (!existing.length) {
    await query(
      "INSERT INTO note_shares (id, note_id, shared_with_email, permission) VALUES (?, ?, ?, ?)",
      [uuidv4(), rows[0].id, req.user.email, rows[0].public_permission],
    );
  } else if (existing[0].permission === "viewer" && rows[0].public_permission === "editor") {
=======
  const existing = await query("SELECT id, permission FROM note_shares WHERE note_id = ? AND shared_with_email = ?", [rows[0].id, req.user.email]);
  if (!existing.length) {
    const { v4: uuidv4 } = require("uuid");
    await query("INSERT INTO note_shares (id, note_id, shared_with_email, permission) VALUES (?, ?, ?, ?)", [uuidv4(), rows[0].id, req.user.email, rows[0].public_permission]);
  } else if (existing[0].permission === 'viewer' && rows[0].public_permission === 'editor') {
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
    await query("UPDATE note_shares SET permission = 'editor' WHERE id = ?", [existing[0].id]);
  }

  return res.json({ message: "Đã thêm vào danh sách chia sẻ.", noteId: rows[0].id });
});

router.get("/", async (req, res) => {
  const view = req.query.view;
<<<<<<< HEAD
  const includeDeleted = view === "all" ? "all" : view === "trash" ? 1 : 0;

=======
  const includeDeleted = view === "all" ? "all" : (view === "trash" ? 1 : 0);
  
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  const notes = await getNotes(req.user.id, req.user.email, {
    date: req.query.date,
    search: req.query.search,
    labelId: req.query.labelId,
<<<<<<< HEAD
    includeDeleted,
    includeShared: view === "all",
    sharedWithMe: view === "shared",
  });

=======
    includeDeleted: includeDeleted,
    includeShared: view === "all",
    sharedWithMe: view === "shared"
  });
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
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
<<<<<<< HEAD
  const { title, content, noteDate, labelIds, isPinned, notePassword, images = [] } = req.body;

  const id = req.body.id || uuidv4();
  const notePasswordHash = notePassword ? await bcrypt.hash(notePassword, 10) : null;
  const pinnedAt = isPinned ? dayjs().format("YYYY-MM-DD HH:mm:ss") : null;

  await query(
    `INSERT INTO notes
      (id, user_id, title, content, note_date, is_pinned, pinned_at, is_password_protected, note_password_hash, images, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
=======
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
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
    [
      id,
      req.user.id,
      title || "Ghi chú mới",
      content || "",
<<<<<<< HEAD
      noteDate || dayjs().format("YYYY-MM-DD"),
      isPinned ? 1 : 0,
      pinnedAt,
=======
      noteDate,
      isPinned ? 1 : 0,
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
      notePassword ? 1 : 0,
      notePasswordHash,
      JSON.stringify(images),
      req.user.full_name,
    ],
  );

  await syncNoteLabels(id, labelIds);
<<<<<<< HEAD
  const note = await getNoteById(id);
  return res.status(201).json({ message: "Đã tạo ghi chú mới.", note });
});

router.post("/:id/password/verify", async (req, res) => {
  const { password } = req.body;

  const rows = await query(
    `SELECT n.*
     FROM notes n
     WHERE n.id = ?
       AND (n.user_id = ? OR EXISTS (SELECT 1 FROM note_shares ns WHERE ns.note_id = n.id AND ns.shared_with_email = ?))
     LIMIT 1`,
    [req.params.id, req.user.id, req.user.email],
  );

  if (!rows.length) {
    return res.status(404).json({ message: "Không tìm thấy ghi chú." });
  }

  if (!rows[0].is_password_protected) {
    const note = await getNoteById(req.params.id);
    return res.json({ message: "Ghi chú không được khóa.", note });
  }

  const valid = await verifyProtectedAccess(rows[0], password);
  if (!valid) {
    return res.status(400).json({ message: "Mật khẩu ghi chú không đúng." });
  }

  const note = await getNoteById(req.params.id);
  return res.json({ message: "Mở khóa thành công.", note });
});

router.post("/:id/password/enable", async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ mật khẩu." });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Mật khẩu xác nhận không khớp." });
  }

  const rows = await query("SELECT id FROM notes WHERE id = ? AND user_id = ? LIMIT 1", [req.params.id, req.user.id]);
  if (!rows.length) {
    return res.status(404).json({ message: "Không tìm thấy ghi chú." });
  }

  const hash = await bcrypt.hash(password, 10);
  await query(
    "UPDATE notes SET is_password_protected = 1, note_password_hash = ? WHERE id = ? AND user_id = ?",
    [hash, req.params.id, req.user.id],
  );

  const note = await getNoteById(req.params.id);
  return res.json({ message: "Đã bật bảo vệ mật khẩu cho ghi chú.", note });
});

router.put("/:id/password", async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Mật khẩu mới xác nhận không khớp." });
  }

  const rows = await query(
    "SELECT is_password_protected, note_password_hash FROM notes WHERE id = ? AND user_id = ? LIMIT 1",
    [req.params.id, req.user.id],
  );
  if (!rows.length) return res.status(404).json({ message: "Không tìm thấy ghi chú." });
  if (!rows[0].is_password_protected) return res.status(400).json({ message: "Ghi chú chưa bật bảo vệ mật khẩu." });

  const valid = await bcrypt.compare(currentPassword, rows[0].note_password_hash || "");
  if (!valid) {
    return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await query("UPDATE notes SET note_password_hash = ? WHERE id = ? AND user_id = ?", [hash, req.params.id, req.user.id]);

  const note = await getNoteById(req.params.id);
  return res.json({ message: "Đã đổi mật khẩu ghi chú.", note });
});

router.post("/:id/password/disable", async (req, res) => {
  const { currentPassword } = req.body;
  if (!currentPassword) {
    return res.status(400).json({ message: "Vui lòng nhập mật khẩu hiện tại." });
  }

  const rows = await query(
    "SELECT is_password_protected, note_password_hash FROM notes WHERE id = ? AND user_id = ? LIMIT 1",
    [req.params.id, req.user.id],
  );
  if (!rows.length) return res.status(404).json({ message: "Không tìm thấy ghi chú." });
  if (!rows[0].is_password_protected) return res.status(400).json({ message: "Ghi chú chưa bật bảo vệ mật khẩu." });

  const valid = await bcrypt.compare(currentPassword, rows[0].note_password_hash || "");
  if (!valid) {
    return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });
  }

  await query(
    "UPDATE notes SET is_password_protected = 0, note_password_hash = NULL WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.id],
  );

  const note = await getNoteById(req.params.id);
  return res.json({ message: "Đã tắt bảo vệ mật khẩu.", note });
=======
  const notes = await getNotes(req.user.id, req.user.email, {});
  return res.status(201).json({ message: "Đã tạo ghi chú mới.", note: notes.find((item) => item.id === id) });
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
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
<<<<<<< HEAD
    `SELECT n.*
     FROM notes n
     WHERE n.id = ?
       AND (n.user_id = ? OR EXISTS (SELECT 1 FROM note_shares ns WHERE ns.note_id = n.id AND ns.shared_with_email = ? AND ns.permission = 'editor'))
     LIMIT 1`,
    [req.params.id, req.user.id, req.user.email],
  );

=======
    `SELECT n.* 
     FROM notes n 
     WHERE n.id = ? AND (n.user_id = ? OR EXISTS (SELECT 1 FROM note_shares ns WHERE ns.note_id = n.id AND ns.shared_with_email = ? AND ns.permission = 'editor')) LIMIT 1`, 
    [req.params.id, req.user.id, req.user.email]
  );
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
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

<<<<<<< HEAD
  const nextPinned = isPinned === undefined ? currentRows[0].is_pinned : isPinned ? 1 : 0;
  let nextPinnedAt = currentRows[0].pinned_at;
  if (!currentRows[0].is_pinned && nextPinned) {
    nextPinnedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
  }
  if (currentRows[0].is_pinned && !nextPinned) {
    nextPinnedAt = null;
  }

  await query(
    `UPDATE notes
     SET title = ?, content = ?, note_date = ?, is_pinned = ?, pinned_at = ?, is_deleted = ?,
=======
  await query(
    `UPDATE notes
     SET title = ?, content = ?, note_date = ?, is_pinned = ?, is_deleted = ?,
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
         is_password_protected = ?, note_password_hash = ?, images = ?, updated_by = ?
     WHERE id = ?`,
    [
      title ?? currentRows[0].title,
      content ?? currentRows[0].content,
      noteDate ?? currentRows[0].note_date,
<<<<<<< HEAD
      nextPinned,
      nextPinnedAt,
=======
      isPinned === undefined ? currentRows[0].is_pinned : isPinned ? 1 : 0,
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
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

<<<<<<< HEAD
  const updatedNote = await getNoteById(req.params.id);

  const io = req.app.get("io");
  if (io && updatedNote) {
    const sharedUsers = await query(
      "SELECT u.id FROM note_shares ns JOIN users u ON u.email = ns.shared_with_email WHERE ns.note_id = ?",
      [req.params.id],
    );
    const targetUsers = new Set([currentRows[0].user_id, ...sharedUsers.map((u) => u.id)]);
    for (const uId of targetUsers) {
      io.to(`user_${uId}`).emit("note_updated", { note: updatedNote, updatedBy: req.user.id });
=======
  const notes = await getNotes(req.user.id, req.user.email, { includeDeleted: Boolean(isDeleted) });
  const updatedNote = notes.find((item) => item.id === req.params.id);
  
  const io = req.app.get('io');
  if (io && updatedNote) {
    const sharedUsers = await query("SELECT u.id FROM note_shares ns JOIN users u ON u.email = ns.shared_with_email WHERE ns.note_id = ?", [req.params.id]);
    
    // Emit to the person who updated it (so their other tabs sync), plus everyone else
    const targetUsers = new Set([currentRows[0].user_id, ...sharedUsers.map(u => u.id)]);
    
    for (const uId of targetUsers) {
      io.to(`user_${uId}`).emit('note_updated', { note: updatedNote, updatedBy: req.user.id });
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
    }
  }

  return res.json({ message: "Ghi chú đã được cập nhật.", note: updatedNote });
});

router.delete("/:id", async (req, res) => {
<<<<<<< HEAD
  const rows = await query("SELECT id FROM notes WHERE id = ? AND user_id = ? LIMIT 1", [
    req.params.id,
    req.user.id,
  ]);
  if (!rows.length) return res.status(404).json({ message: "Không tìm thấy ghi chú." });

=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  await query("UPDATE notes SET is_deleted = 1 WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
  return res.json({ message: "Ghi chú đã được chuyển vào thùng rác." });
});

router.delete("/:id/permanent", async (req, res) => {
<<<<<<< HEAD
  const rows = await query("SELECT id FROM notes WHERE id = ? AND user_id = ? LIMIT 1", [
    req.params.id,
    req.user.id,
  ]);
  if (!rows.length) return res.status(404).json({ message: "Không tìm thấy ghi chú." });

=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
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
<<<<<<< HEAD
  const notes = await query("SELECT public_permission, share_token FROM notes WHERE id = ? AND user_id = ?", [
    req.params.id,
    req.user.id,
  ]);
  if (!notes.length) return res.status(404).json({ message: "Không tìm thấy ghi chú." });

  const shares = await query(
    "SELECT shared_with_email as email, permission, created_at FROM note_shares WHERE note_id = ? ORDER BY created_at DESC",
    [req.params.id],
  );
=======
  const notes = await query("SELECT public_permission, share_token FROM notes WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
  if (!notes.length) return res.status(404).json({ message: "Không tìm thấy ghi chú." });
  
  const shares = await query("SELECT shared_with_email as email, permission FROM note_shares WHERE note_id = ?", [req.params.id]);
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  return res.json({ publicPermission: notes[0].public_permission, shareToken: notes[0].share_token, shares });
});

router.put("/:id/shares/public", async (req, res) => {
  const { permission } = req.body;
<<<<<<< HEAD
  if (!["none", "viewer", "editor"].includes(permission)) {
    return res.status(400).json({ message: "Quyền không hợp lệ." });
  }

=======
  if (!['none', 'viewer', 'editor'].includes(permission)) return res.status(400).json({ message: "Quyền không hợp lệ." });
  
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  await query("UPDATE notes SET public_permission = ? WHERE id = ? AND user_id = ?", [permission, req.params.id, req.user.id]);
  return res.json({ message: "Đã cập nhật quyền truy cập công khai." });
});

router.post("/:id/shares/user", async (req, res) => {
  const { email, permission } = req.body;
<<<<<<< HEAD
  if (!["viewer", "editor"].includes(permission)) {
    return res.status(400).json({ message: "Quyền không hợp lệ." });
  }
  if (email === req.user.email) {
    return res.status(400).json({ message: "Không thể tự chia sẻ cho chính mình." });
  }

  const userRows = await query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  if (!userRows.length) {
    return res.status(404).json({ message: "Email người nhận không tồn tại trong hệ thống." });
  }
=======
  if (!['viewer', 'editor'].includes(permission)) return res.status(400).json({ message: "Quyền không hợp lệ." });
  if (email === req.user.email) return res.status(400).json({ message: "Không thể tự chia sẻ cho chính mình." });
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739

  const existing = await query("SELECT id FROM note_shares WHERE note_id = ? AND shared_with_email = ?", [req.params.id, email]);
  if (existing.length) {
    await query("UPDATE note_shares SET permission = ? WHERE id = ?", [permission, existing[0].id]);
  } else {
<<<<<<< HEAD
    await query("INSERT INTO note_shares (id, note_id, shared_with_email, permission) VALUES (?, ?, ?, ?)", [
      uuidv4(),
      req.params.id,
      email,
      permission,
    ]);
  }

  if (userRows.length > 0) {
    const targetUserId = userRows[0].id;
    const note = await getNoteById(req.params.id);
    const noteTitle = note?.title || "Ghi chú";
    
    // Gửi Push Notification
    sendPushNotification(targetUserId, {
      title: 'Ghi chú mới được chia sẻ!',
      body: `${req.user.full_name} đã chia sẻ ghi chú "${noteTitle}" với bạn.`,
      icon: '/icon-192x192.png',
      data: {
        url: `/ghi-chu/${req.params.id}`
      }
    });

    // Gửi Socket.IO event để UI cập nhật ngay lập tức nếu đang online
    const io = req.app.get("io");
    if (io && note) {
      io.to(`user_${targetUserId}`).emit("note_shared", { 
        note: { ...note, isSharedWithMe: true, sharedPermission: permission },
        sharedBy: req.user.full_name
      });
    }
  }

=======
    const { v4: uuidv4 } = require("uuid");
    await query("INSERT INTO note_shares (id, note_id, shared_with_email, permission) VALUES (?, ?, ?, ?)", [uuidv4(), req.params.id, email, permission]);
  }
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  return res.json({ message: "Đã chia sẻ ghi chú thành công." });
});

router.delete("/:id/shares/user/:email", async (req, res) => {
  await query("DELETE FROM note_shares WHERE note_id = ? AND shared_with_email = ?", [req.params.id, req.params.email]);
  return res.json({ message: "Đã xóa người dùng khỏi danh sách chia sẻ." });
});

router.post("/:id/images", upload.single("image"), async (req, res) => {
<<<<<<< HEAD
  const rows = await query("SELECT images FROM notes WHERE id = ? AND user_id = ? LIMIT 1", [req.params.id, req.user.id]);
  if (!rows.length) {
    return res.status(404).json({ message: "Không tìm thấy ghi chú." });
  }
  if (!req.file) {
    return res.status(400).json({ message: "Vui lòng chọn ảnh để tải lên." });
  }
=======
  const rows = await query("SELECT images FROM notes WHERE id = ? AND user_id = ? LIMIT 1", [
    req.params.id,
    req.user.id,
  ]);
  if (!rows.length) {
    return res.status(404).json({ message: "Không tìm thấy ghi chú." });
  }
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739

  const existingImages = rows[0].images ? JSON.parse(rows[0].images) : [];
  const imagePath = `/uploads/${req.file.filename}`;
  existingImages.push(imagePath);
<<<<<<< HEAD

=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  await query("UPDATE notes SET images = ? WHERE id = ? AND user_id = ?", [
    JSON.stringify(existingImages),
    req.params.id,
    req.user.id,
  ]);
<<<<<<< HEAD

=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  return res.json({ message: "Đã tải ảnh lên ghi chú.", images: existingImages });
});

module.exports = router;
