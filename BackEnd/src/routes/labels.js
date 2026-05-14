const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { authMiddleware } = require("../middleware/auth");
const { query } = require("../config/db");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  const labels = await query(
    `SELECT l.*,
            (SELECT COUNT(*) FROM note_labels nl
             INNER JOIN notes n ON n.id = nl.note_id
             WHERE nl.label_id = l.id AND n.is_deleted = 0) AS note_count
     FROM labels l
     WHERE l.user_id = ?
     ORDER BY l.name ASC`,
    [req.user.id],
  );

  return res.json({
    labels: labels.map((label) => ({
      id: label.id,
      name: label.name,
      color: label.color,
      noteCount: Number(label.note_count || 0),
    })),
  });
});

router.post("/", async (req, res) => {
  const { name, color } = req.body;
  const id = uuidv4();
  await query("INSERT INTO labels (id, user_id, name, color) VALUES (?, ?, ?, ?)", [
    id,
    req.user.id,
    name,
    color || "#5b5cf0",
  ]);
  return res.status(201).json({ message: "Đã tạo nhãn mới.", label: { id, name, color: color || "#5b5cf0" } });
});

router.put("/:id", async (req, res) => {
  const { name, color } = req.body;
  await query("UPDATE labels SET name = ?, color = ? WHERE id = ? AND user_id = ?", [
    name,
    color,
    req.params.id,
    req.user.id,
  ]);
  return res.json({ message: "Nhãn đã được cập nhật." });
});

router.delete("/:id", async (req, res) => {
  await query("DELETE FROM labels WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
  return res.json({ message: "Nhãn đã được xóa." });
});

module.exports = router;
