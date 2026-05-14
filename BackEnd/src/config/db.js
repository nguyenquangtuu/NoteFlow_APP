const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "noteflow",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function initDatabase() {
<<<<<<< HEAD
=======
  // Đảm bảo Database sử dụng utf8mb4
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  await query(`ALTER DATABASE \`${process.env.DB_NAME || "noteflow"}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) PRIMARY KEY,
      full_name VARCHAR(120) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      avatar_url VARCHAR(255) DEFAULT NULL,
      preferences JSON DEFAULT NULL,
      is_active TINYINT(1) DEFAULT 0,
      activation_token VARCHAR(255) DEFAULT NULL,
      reset_token VARCHAR(255) DEFAULT NULL,
      reset_token_expires_at DATETIME DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS labels (
      id CHAR(36) PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      name VARCHAR(80) NOT NULL,
      color VARCHAR(20) NOT NULL DEFAULT '#5b5cf0',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_labels_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS notes (
      id CHAR(36) PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      title VARCHAR(160) NOT NULL,
      content LONGTEXT,
      note_date DATE NOT NULL,
      is_pinned TINYINT(1) DEFAULT 0,
<<<<<<< HEAD
      pinned_at DATETIME DEFAULT NULL,
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
      is_deleted TINYINT(1) DEFAULT 0,
      is_password_protected TINYINT(1) DEFAULT 0,
      note_password_hash VARCHAR(255) DEFAULT NULL,
      images JSON DEFAULT NULL,
      share_token VARCHAR(255) DEFAULT NULL,
<<<<<<< HEAD
      public_permission ENUM('none', 'viewer', 'editor') NOT NULL DEFAULT 'none',
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
      updated_by VARCHAR(120) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_notes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS note_labels (
      note_id CHAR(36) NOT NULL,
      label_id CHAR(36) NOT NULL,
      PRIMARY KEY (note_id, label_id),
      CONSTRAINT fk_note_labels_note FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
      CONSTRAINT fk_note_labels_label FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS note_shares (
      id CHAR(36) PRIMARY KEY,
      note_id CHAR(36) NOT NULL,
      shared_with_email VARCHAR(190) NOT NULL,
      permission ENUM('viewer', 'editor') NOT NULL DEFAULT 'viewer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_note_shares_note FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

<<<<<<< HEAD
  await query(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      subscription JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_push_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  try { await query("ALTER TABLE notes ADD COLUMN pinned_at DATETIME NULL"); } catch (e) {}
  try { await query("ALTER TABLE notes ADD COLUMN public_permission ENUM('none', 'viewer', 'editor') NOT NULL DEFAULT 'none'"); } catch (e) {}

  try { await query("ALTER TABLE labels DROP FOREIGN KEY fk_labels_user"); } catch (e) {}
  try { await query("ALTER TABLE notes DROP FOREIGN KEY fk_notes_user"); } catch (e) {}
  try { await query("ALTER TABLE note_labels DROP FOREIGN KEY fk_note_labels_note"); } catch (e) {}
  try { await query("ALTER TABLE note_labels DROP FOREIGN KEY fk_note_labels_label"); } catch (e) {}
  try { await query("ALTER TABLE note_shares DROP FOREIGN KEY fk_note_shares_note"); } catch (e) {}
  try { await query("ALTER TABLE push_subscriptions DROP FOREIGN KEY fk_push_subscriptions_user"); } catch (e) {}

  const tables = ["users", "labels", "notes", "note_labels", "note_shares", "push_subscriptions"];
  for (const table of tables) {
    try {
      await query(`ALTER TABLE \`${table}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    } catch (error) {
      console.warn(`Cannot convert ${table}:`, error.message);
    }
  }

  try { await query("ALTER TABLE labels ADD CONSTRAINT fk_labels_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE"); } catch (e) {}
  try { await query("ALTER TABLE notes ADD CONSTRAINT fk_notes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE"); } catch (e) {}
  try { await query("ALTER TABLE note_labels ADD CONSTRAINT fk_note_labels_note FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE"); } catch (e) {}
  try { await query("ALTER TABLE note_labels ADD CONSTRAINT fk_note_labels_label FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE"); } catch (e) {}
  try { await query("ALTER TABLE note_shares ADD CONSTRAINT fk_note_shares_note FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE"); } catch (e) {}
  try { await query("ALTER TABLE push_subscriptions ADD CONSTRAINT fk_push_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE"); } catch (e) {}
=======
  try {
    await query("ALTER TABLE notes ADD COLUMN public_permission ENUM('none', 'viewer', 'editor') NOT NULL DEFAULT 'none'");
  } catch(e) {}

  // Xóa các khóa ngoại tạm thời để cho phép convert toàn bộ các cột (bao gồm cả ID)
  try { await query("ALTER TABLE `labels` DROP FOREIGN KEY `fk_labels_user`"); } catch (e) {}
  try { await query("ALTER TABLE `notes` DROP FOREIGN KEY `fk_notes_user`"); } catch (e) {}
  try { await query("ALTER TABLE `note_labels` DROP FOREIGN KEY `fk_note_labels_note`"); } catch (e) {}
  try { await query("ALTER TABLE `note_labels` DROP FOREIGN KEY `fk_note_labels_label`"); } catch (e) {}
  try { await query("ALTER TABLE `note_shares` DROP FOREIGN KEY `fk_note_shares_note`"); } catch (e) {}

  // Convert toàn bộ các bảng và TẤT CẢ các cột sang utf8mb4 để hỗ trợ đa ngôn ngữ
  const tables = ["users", "labels", "notes", "note_labels", "note_shares"];
  for (const table of tables) {
    try {
      await query(`ALTER TABLE \`${table}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    } catch (err) {
      console.warn(`Lỗi khi convert bảng ${table}:`, err.message);
    }
  }

  // Thêm lại các khóa ngoại
  try { await query("ALTER TABLE `labels` ADD CONSTRAINT `fk_labels_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE"); } catch (e) {}
  try { await query("ALTER TABLE `notes` ADD CONSTRAINT `fk_notes_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE"); } catch (e) {}
  try { await query("ALTER TABLE `note_labels` ADD CONSTRAINT `fk_note_labels_note` FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON DELETE CASCADE"); } catch (e) {}
  try { await query("ALTER TABLE `note_labels` ADD CONSTRAINT `fk_note_labels_label` FOREIGN KEY (`label_id`) REFERENCES `labels`(`id`) ON DELETE CASCADE"); } catch (e) {}
  try { await query("ALTER TABLE `note_shares` ADD CONSTRAINT `fk_note_shares_note` FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON DELETE CASCADE"); } catch (e) {}
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
}

module.exports = {
  pool,
  query,
  initDatabase,
};
