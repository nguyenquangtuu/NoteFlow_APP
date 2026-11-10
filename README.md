# HƯỚNG DẪN CHẠY DỰ ÁN NOTEFLOW

## I. THÔNG TIN CHUNG
* **Đề tài:** Xây dựng hệ thống quản lý nhật ký theo thời gian thực - NoteFlow
* **Sinh viên thực hiện:**
  * Ngô Tấn Thành - MSSV: `524H0031`
  * Nguyễn Quang Tựu - MSSV: `524H0136`
* **Repository:** [https://github.com/nguyenquangtuu/NoteFlow_APP.git](https://github.com/nguyenquangtuu/NoteFlow_APP.git)

---

## II. CÔNG CỤ CẦN CÓ TRÊN MÁY
1. **Git**
2. **Docker Desktop** (đang bật)
3. **Android Studio** (đã tạo sẵn 1 máy ảo Android Emulator)

---

## III. THỨ TỰ THỰC THI DỰ ÁN

### Bước 1: Tải mã nguồn về máy
* **Vị trí thực hiện:** Mở Terminal tại thư mục muốn lưu dự án trên máy tính.
* **Thao tác:** Chạy lệnh:
  ```bash
  git clone https://github.com/nguyenquangtuu/NoteFlow_APP.git
  cd NoteFlow_APP
  ```

### Bước 2: Khởi chạy Backend và Cơ sở dữ liệu
* **Vị trí thực hiện:** Tại thư mục gốc của dự án (`NoteFlow_APP/`).
* **Thao tác:** Chạy lệnh:
  ```bash
  docker compose up --build -d
  ```
  *Lệnh này tự động khởi động MySQL 8.0, tạo database `noteflow`, nạp sẵn cấu trúc và dữ liệu mẫu thử nghiệm, chạy server tại cổng 4000.*
* **Kiểm tra:** Mở trình duyệt truy cập `http://localhost:4000/api/notes` để kiểm tra server hoạt động.

### Bước 3: Khởi chạy ứng dụng Android
* **Vị trí thực hiện:** Mở phần mềm Android Studio.
* **Thao tác:**
  1. Chọn **Open** > Duyệt và chọn thư mục `Android` bên trong dự án (`NoteFlow_APP/Android`).
  2. Chờ Android Studio đồng bộ Gradle xong.
  3. Bật máy ảo Android Emulator trên Device Manager.
  4. Nhấn nút **Run** trên thanh công cụ (phím tắt `Shift + F10`) để cài đặt và mở app.

---

## IV. TÀI KHOẢN ĐĂNG NHẬP KIỂM THỬ TRÊN APP
Sau khi mở ứng dụng trên máy ảo, đăng nhập bằng tài khoản đã được nạp sẵn dữ liệu:
* **Tài khoản chủ sở hữu:**
  * Email: `thanh524h0031@student.tdtu.edu.vn`
  * Mật khẩu: `12345678`
* **Tài khoản cộng tác viên:**
  * Email: `tuu524h0136@student.tdtu.edu.vn`
  * Mật khẩu: `12345678`
* **Mật khẩu mở khóa trang ghi chú bảo vệ:** `123456`

---

## V. TẮT HỆ THỐNG SAU KHI CHẤM
* **Vị trí thực hiện:** Mở Terminal tại thư mục gốc dự án (`NoteFlow_APP/`).
* **Thao tác:** Chạy lệnh:
  ```bash
  docker compose down
  ```
