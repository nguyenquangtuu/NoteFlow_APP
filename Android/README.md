# NoteFlow Android Application (Java)

Ứng dụng ghi chú thông minh NoteFlow dành cho hệ điều hành Android, được xây dựng hoàn toàn bằng **Java**, tuân thủ kiến trúc **MVVM (Model - View - ViewModel)** và dùng chung 100% hệ thống REST API & Realtime Socket.IO của Backend NoteFlow.

---

## 📱 Tính năng đã hoàn thiện

1. **Xác thực (Authentication):**
   * Đăng nhập (`LoginActivity`) & Đăng ký tài khoản (`RegisterActivity`).
   * Quên mật khẩu (`ForgotPasswordActivity`).
   * Tự động duy trì phiên đăng nhập với JWT Bearer Token.

2. **Quản lý ghi chú (Dashboard & Notes CRUD):**
   * Hiển thị danh sách ghi chú với 2 chế độ: **Lưới (Staggered Grid)** hoặc **Dòng (List)**.
   * Lọc ghi chú: **Tất cả**, **Đã ghim**, **Đã chia sẻ với tôi**, **Thùng rác**.
   * Lọc ghi chú theo **Ngày cụ thể** (Calendar / DatePickerDialog) hoặc xem tất cả các ngày.
   * Tìm kiếm tức thì theo từ khóa trong tiêu đề và nội dung.
   * Sắp xếp ghi chú theo **Mới nhất** $\leftrightarrow$ **Cũ nhất**.
   * Ghim / Bỏ ghim ghi chú, khôi phục từ thùng rác, xóa vĩnh viễn.

3. **Trình soạn thảo ghi chú (Note Editor):**
   * **Auto-save:** Tự động lưu sau 800ms khi người dùng ngừng gõ phím.
   * **Checklist:** Nút phím tắt chèn nhanh cú pháp checklist `[ ] `.
   * **Nhập giọng nói tiếng Việt:** Tích hợp `SpeechRecognizer` native của Android (`vi-VN`).
   * **Đính kèm ảnh:** Chọn ảnh từ thư viện/máy ảnh, tải lên server qua API multipart và xem danh sách ảnh đính kèm.

4. **Bảo mật & Khóa ghi chú (Note Password Protection):**
   * Khóa ghi chú bằng mật khẩu riêng biệt.
   * Hộp thoại nhập mật khẩu để mở khóa xem nội dung.
   * Hỗ trợ thiết lập mật khẩu mới, đổi mật khẩu và gỡ bỏ khóa bảo vệ.

5. **Quản lý Nhãn (Labels):**
   * Tạo mới, đổi tên, chọn màu sắc từ bảng màu và xóa nhãn.
   * Gán / gỡ một hoặc nhiều nhãn cho từng ghi chú.
   * Lọc ghi chú theo từng nhãn trực tiếp từ Navigation Drawer.

6. **Chia sẻ & Cộng tác (Sharing & Collaboration):**
   * Tạo liên kết chia sẻ công khai (`share_token`), tùy chỉnh quyền (`viewer` hoặc `editor`).
   * Mời cộng tác viên qua Email với phân quyền tương ứng.
   * Xem danh sách và thu hồi quyền truy cập.

7. **Thời gian thực (Realtime Socket.IO):**
   * Kết nối Socket.IO tới room `user_${userId}`.
   * Nhận cập nhật ghi chú ngay lập tức (`note_updated`).
   * Nhận thông báo hệ thống khi được người khác chia sẻ ghi chú mới (`note_shared`).

8. **Hồ sơ & Giao diện (Profile & Settings):**
   * Cập nhật họ tên người dùng.
   * Đổi mật khẩu tài khoản.
   * Chuyển đổi giao diện **Sáng / Tối (Light / Dark Mode)**.

---

## 🚀 Hướng dẫn mở và chạy trên Android Studio

### 1. Yêu cầu môi trường
* **Android Studio:** Phiên bản Iguana / Jellyfish / Koala / Ladybug hoặc mới hơn.
* **JDK:** Java 17 (đã tích hợp sẵn trong Android Studio).
* **Android SDK:** Compile SDK 34, Min SDK 26 (Android 8.0 trở lên).

### 2. Mở dự án
1. Khởi động Android Studio.
2. Chọn **Open** (hoặc **File > Open**).
3. Duyệt và chọn thư mục `Android` trong thư mục gốc của repository.
4. Chờ Gradle đồng bộ (Sync Project with Gradle Files).

### 3. Cấu hình địa chỉ IP kết nối Backend
Mở file `app/src/main/java/com/noteflow/app/utils/Constants.java`:
```java
// Nếu chạy trên Android Emulator:
public static final String SERVER_HOST = "http://10.0.2.2:4000";

// Nếu chạy trên điện thoại thật cắm cáp USB hoặc cùng mạng WiFi:
// Thay bằng địa chỉ IPv4 máy tính của bạn (xem bằng lệnh ipconfig):
// public static final String SERVER_HOST = "http://192.168.1.xxx:4000";
```

### 4. Khởi chạy Backend
Đảm bảo Backend Node.js và MySQL đang chạy:
```bash
cd BackEnd
npm run dev
```

### 5. Chạy ứng dụng
* Nhấn nút **Run 'app'** (phím tắt `Shift + F10`) trên thanh công cụ của Android Studio để cài đặt và chạy ứng dụng trên máy ảo hoặc thiết bị thật.
