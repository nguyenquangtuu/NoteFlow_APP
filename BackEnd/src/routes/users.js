const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { query } = require("../config/db");

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  return res.json({
    user: {
      id: req.user.id,
      fullName: req.user.full_name,
      email: req.user.email,
      avatarUrl: req.user.avatar_url,
      preferences: req.user.preferences ? JSON.parse(req.user.preferences) : null,
<<<<<<< HEAD
      isActive: Boolean(req.user.is_active),
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
    },
  });
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { fullName, avatarUrl, preferences } = req.body;
<<<<<<< HEAD
    const currentPreferences = req.user.preferences ? JSON.parse(req.user.preferences) : {};
    const nextPreferences = {
      ...currentPreferences,
      ...(preferences || {}),
    };

    await query(
      "UPDATE users SET full_name = ?, avatar_url = ?, preferences = ? WHERE id = ?",
      [
        fullName ?? req.user.full_name,
        avatarUrl ?? req.user.avatar_url,
        JSON.stringify(nextPreferences),
=======
    await query(
      "UPDATE users SET full_name = ?, avatar_url = ?, preferences = ? WHERE id = ?",
      [
        fullName || req.user.full_name,
        avatarUrl || req.user.avatar_url,
        JSON.stringify(preferences || (req.user.preferences ? JSON.parse(req.user.preferences) : {})),
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
        req.user.id,
      ],
    );

    const users = await query(
<<<<<<< HEAD
      "SELECT id, full_name, email, avatar_url, preferences, is_active FROM users WHERE id = ? LIMIT 1",
=======
      "SELECT id, full_name, email, avatar_url, preferences FROM users WHERE id = ? LIMIT 1",
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
      [req.user.id],
    );

    return res.json({
      message: "Thông tin tài khoản đã được cập nhật.",
      user: {
        id: users[0].id,
        fullName: users[0].full_name,
        email: users[0].email,
        avatarUrl: users[0].avatar_url,
        preferences: users[0].preferences ? JSON.parse(users[0].preferences) : null,
<<<<<<< HEAD
        isActive: Boolean(users[0].is_active),
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Không thể cập nhật tài khoản.", error: error.message });
  }
});

module.exports = router;
