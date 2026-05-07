const express = require("express");
const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const { v4: uuidv4 } = require("uuid");
const { query } = require("../config/db");
const { sendMail } = require("../config/mailer");
const { authMiddleware } = require("../middleware/auth");
const { createAccessToken, createOpaqueToken } = require("../utils/tokens");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    const existingUsers = await query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    if (existingUsers.length) {
      return res.status(409).json({ message: "Email đã được sử dụng." });
    }

    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    const activationToken = createOpaqueToken();
    const preferences = JSON.stringify({
      theme: "light",
      defaultView: "list",
      language: "vi",
    });

    await query(
      `INSERT INTO users (id, full_name, email, password_hash, activation_token, preferences)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, fullName, email, passwordHash, activationToken, preferences],
    );

    const activationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/dang-nhap?kich-hoat=${activationToken}`;
    await sendMail({
      to: email,
      subject: "Kích hoạt tài khoản NoteFlow",
      html: `<p>Xin chào ${fullName},</p><p>Hãy kích hoạt tài khoản của bạn tại <a href="${activationUrl}">${activationUrl}</a></p>`,
    });

    return res.status(201).json({
      message: "Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.",
      activationToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Không thể đăng ký tài khoản.", error: error.message });
  }
});

router.post("/activate", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Thiếu mã kích hoạt." });
    }

    const users = await query("SELECT id FROM users WHERE activation_token = ? LIMIT 1", [token]);
    if (!users.length) {
      return res.status(400).json({ message: "Mã kích hoạt không hợp lệ." });
    }

    await query("UPDATE users SET is_active = 1, activation_token = NULL WHERE id = ?", [users[0].id]);
    return res.json({ message: "Tài khoản đã được kích hoạt. Bạn có thể đăng nhập." });
  } catch (error) {
    return res.status(500).json({ message: "Không thể kích hoạt tài khoản.", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);

    if (!users.length) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: "Tài khoản chưa kích hoạt qua email." });
    }

    const token = createAccessToken(user.id);
    return res.json({
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        avatarUrl: user.avatar_url,
        preferences: user.preferences ? JSON.parse(user.preferences) : null,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Không thể đăng nhập.", error: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const users = await query("SELECT id, full_name FROM users WHERE email = ? LIMIT 1", [email]);

    if (!users.length) {
      return res.json({ message: "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi." });
    }

    const resetToken = createOpaqueToken();
    const expiresAt = dayjs().add(30, "minute").format("YYYY-MM-DD HH:mm:ss");
    await query(
      "UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?",
      [resetToken, expiresAt, users[0].id],
    );

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/dat-lai-mat-khau?token=${resetToken}`;
    await sendMail({
      to: email,
      subject: "Đặt lại mật khẩu NoteFlow",
      html: `<p>Xin chào ${users[0].full_name},</p><p>Bạn có thể đặt lại mật khẩu tại <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    return res.json({
      message: "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.",
      resetToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Không thể tạo yêu cầu đặt lại mật khẩu.", error: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    const users = await query(
      "SELECT id, reset_token_expires_at FROM users WHERE reset_token = ? LIMIT 1",
      [token],
    );

    if (!users.length) {
      return res.status(400).json({ message: "Liên kết đặt lại mật khẩu không hợp lệ." });
    }

    if (dayjs(users[0].reset_token_expires_at).isBefore(dayjs())) {
      return res.status(400).json({ message: "Liên kết đặt lại mật khẩu đã hết hạn." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await query(
      "UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?",
      [passwordHash, users[0].id],
    );

    return res.json({ message: "Mật khẩu đã được cập nhật." });
  } catch (error) {
    return res.status(500).json({ message: "Không thể đặt lại mật khẩu.", error: error.message });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  return res.json({
    user: {
      id: req.user.id,
      fullName: req.user.full_name,
      email: req.user.email,
      avatarUrl: req.user.avatar_url,
      preferences: req.user.preferences ? JSON.parse(req.user.preferences) : null,
    },
  });
});

router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const users = await query("SELECT password_hash FROM users WHERE id = ? LIMIT 1", [req.user.id]);
    const isMatch = await bcrypt.compare(currentPassword, users[0].password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, req.user.id]);
    return res.json({ message: "Mật khẩu đã được thay đổi." });
  } catch (error) {
    return res.status(500).json({ message: "Không thể đổi mật khẩu.", error: error.message });
  }
});

module.exports = router;
