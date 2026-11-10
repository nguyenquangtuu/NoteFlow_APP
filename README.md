# NoteFlow - Hướng dẫn chạy dự án

Repository: [https://github.com/nguyenquangtuu/NoteFlow_APP.git](https://github.com/nguyenquangtuu/NoteFlow_APP.git)

## 1. Thông tin nhóm & Tài khoản thử nghiệm
* **Ngô Tấn Thành** - MSSV: `524H0031`
* **Nguyễn Quang Tựu** - MSSV: `524H0136`

| Tài khoản | Email | Mật khẩu | Mật khẩu ghi chú khóa |
| :--- | :--- | :--- | :--- |
| Chủ sở hữu | `thanh524h0031@student.tdtu.edu.vn` | `12345678` | `123456` |
| Cộng tác viên | `tuu524h0136@student.tdtu.edu.vn` | `12345678` | |

---

## 2. Quy trình 2 bước khởi chạy toàn bộ hệ thống

### Bước 1: Dựng Backend & Database bằng 1 lệnh Docker duy nhất

Mở Terminal tại thư mục gốc dự án:

```bash
docker compose up --build -d
```

> **Cơ chế tự động:** Lệnh này tự động build server Node.js, khởi chạy MySQL 8.0, nạp toàn bộ cấu trúc bảng (`schema.sql`) và dữ liệu mẫu (`seed.sql`) chứa sẵn 2 tài khoản trên cùng 4 ghi chú thực nghiệm. Server lắng nghe tại `http://localhost:4000`.

* Kiểm tra Backend: truy cập `http://localhost:4000/api/notes`
* Dừng hệ thống khi chấm xong: `docker compose down`

---

### Bước 2: Chạy ứng dụng Android

#### Lựa chọn A: Chạy bằng dòng lệnh Terminal (Không cần mở Android Studio)
*Yêu cầu: Máy tính đã mở sẵn máy ảo Android hoặc cắm cáp điện thoại Android.*

```bash
cd Android

# Cài đặt và mở app lên thiết bị
.\gradlew.bat installDebug       # Windows (hoặc ./gradlew installDebug trên macOS/Linux)
adb shell am start -n com.noteflow.app/.ui.main.MainActivity
```

#### Lựa chọn B: Mở qua Android Studio
1. Mở Android Studio, chọn **Open** và duyệt đến thư mục `Android` (`NoteFlow_APP/Android`).
2. Nhấn nút **Run 'app'** (`Shift + F10`) để khởi chạy.

> **Cấu hình IP kết nối:**
> * Trên máy ảo Android: Mặc định đã trỏ sẵn về `http://10.0.2.2:4000`, không cần sửa gì.
> * Trên máy thật: Đổi `SERVER_HOST` trong `Android/app/src/main/java/com/noteflow/app/utils/Constants.java` thành địa chỉ IPv4 máy tính cùng mạng WiFi.
