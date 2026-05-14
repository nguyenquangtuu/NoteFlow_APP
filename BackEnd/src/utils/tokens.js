const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

function createAccessToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "noteflow-secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function createOpaqueToken() {
  return uuidv4().replace(/-/g, "");
}

module.exports = {
  createAccessToken,
  createOpaqueToken,
};
