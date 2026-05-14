CREATE DATABASE IF NOT EXISTS noteflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE noteflow;

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
);

CREATE TABLE IF NOT EXISTS labels (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  name VARCHAR(80) NOT NULL,
  color VARCHAR(20) NOT NULL DEFAULT '#5b5cf0',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_labels_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

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
);

CREATE TABLE IF NOT EXISTS note_labels (
  note_id CHAR(36) NOT NULL,
  label_id CHAR(36) NOT NULL,
  PRIMARY KEY (note_id, label_id),
  CONSTRAINT fk_note_labels_note FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  CONSTRAINT fk_note_labels_label FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
);
<<<<<<< HEAD

CREATE TABLE IF NOT EXISTS note_shares (
  id CHAR(36) PRIMARY KEY,
  note_id CHAR(36) NOT NULL,
  shared_with_email VARCHAR(190) NOT NULL,
  permission ENUM('viewer', 'editor') NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_note_shares_note FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  subscription JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_push_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
