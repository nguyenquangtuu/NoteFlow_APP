const jwt = require("jsonwebtoken");
const { query } = require("../config/db");

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "noteflow-secret");
    const users = await query(
      "SELECT id, full_name, email, avatar_url, preferences, is_active FROM users WHERE id = ? LIMIT 1",
      [payload.userId],
    );

    if (!users.length) {
      return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ." });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ." });
  }
}

module.exports = {
  authMiddleware,
};
