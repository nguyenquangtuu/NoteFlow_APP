-- NoteFlow Database Seed Data
USE noteflow;

-- 1. Tài khoản người dùng (Mật khẩu: 12345678)
INSERT INTO users (id, full_name, email, password_hash, is_active) VALUES
('u1111111-1111-1111-1111-111111111111', 'Ngô Tấn Thành', 'thanh524h0031@student.tdtu.edu.vn', '$2b$10$7mCR.2ylgjFmBfcCSbonJu0myEHntbyQdE7.aVuSPeGUQwol0Wbay', 1),
('u2222222-2222-2222-2222-222222222222', 'Nguyễn Quang Tựu', 'tuu524h0136@student.tdtu.edu.vn', '$2b$10$7mCR.2ylgjFmBfcCSbonJu0myEHntbyQdE7.aVuSPeGUQwol0Wbay', 1)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), password_hash=VALUES(password_hash), is_active=1;

-- 2. Nhãn phân loại của Ngô Tấn Thành
INSERT INTO labels (id, user_id, name, color) VALUES
('l1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'Công việc', '#F59E0B'),
('l2222222-2222-2222-2222-222222222222', 'u1111111-1111-1111-1111-111111111111', 'Quan trọng', '#EF4444'),
('l3333333-3333-3333-3333-333333333333', 'u1111111-1111-1111-1111-111111111111', 'Sinh hoạt', '#10B981'),
('l4444444-4444-4444-4444-444444444444', 'u1111111-1111-1111-1111-111111111111', 'Học tập', '#4F46E5')
ON DUPLICATE KEY UPDATE name=VALUES(name), color=VALUES(color);

-- 3. Ghi chú mẫu ban đầu (Mật khẩu mở khóa ghi chú 1: 123456)
INSERT INTO notes (id, user_id, title, content, note_date, is_pinned, is_password_protected, note_password_hash, updated_by) VALUES
('n1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'Sổ tay tài khoản học tập', 'Danh sách cổng sinh viên, email trường và hệ thống thư viện cần dùng trong học kỳ.', '2026-11-04', 1, 1, '$2b$10$SZAywcbsG11Ba5WvN.Kuze7dpkv1c26B3bD31WIcc0.4ze5jP8sny', 'Ngô Tấn Thành'),
('n2222222-2222-2222-2222-222222222222', 'u1111111-1111-1111-1111-111111111111', 'Nhật ký đọc sách và ghi chép tuần', '1. Hoàn thành chương 4 cuốn Thói quen nguyên tử và tóm tắt các ý chính vào sổ tay cá nhân.\n2. Ghi lại ba thói quen cần duy trì trong tuần.', '2026-11-04', 0, 0, NULL, 'Ngô Tấn Thành'),
('n3333333-3333-3333-3333-333333333333', 'u1111111-1111-1111-1111-111111111111', 'Lịch trình chuyến đi Đà Lạt cuối tuần', 'Kế hoạch di chuyển và lưu trú của nhóm:\n1. Đặt phòng homestay gần trung tâm Hòa Bình\n2. Thuê xe máy 2 ngày tại đường Bùi Thị Xuân\n3. Tham quan đồi chè Cầu Đất lúc 06:30 thứ Bảy\n4. Ghé quán cà phê Túi Mơ To và ăn tối lẩu gà', '2026-11-04', 0, 0, NULL, 'Ngô Tấn Thành'),
('n4444444-4444-4444-4444-444444444444', 'u1111111-1111-1111-1111-111111111111', 'Ôn tập từ vựng tiếng Anh tuần 11', 'Ôn 40 từ vựng chủ đề công nghệ và làm bài kiểm tra ngắn vào tối thứ Năm.', '2026-11-04', 0, 0, NULL, 'Ngô Tấn Thành')
ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), is_pinned=VALUES(is_pinned);

-- 4. Gắn nhãn cho ghi chú
INSERT INTO note_labels (note_id, label_id) VALUES
('n1111111-1111-1111-1111-111111111111', 'l2222222-2222-2222-2222-222222222222'),
('n2222222-2222-2222-2222-222222222222', 'l4444444-4444-4444-4444-444444444444'),
('n3333333-3333-3333-3333-333333333333', 'l3333333-3333-3333-3333-333333333333'),
('n4444444-4444-4444-4444-444444444444', 'l4444444-4444-4444-4444-444444444444')
ON DUPLICATE KEY UPDATE label_id=VALUES(label_id);
