# NoteFlow - Ứng dụng Ghi chú Thông minh

Ứng dụng ghi chú thông minh đa nền tảng theo ngày, hỗ trợ tiếng Việt, bảo vệ mật khẩu, đính kèm đa phương tiện, chia sẻ cộng tác và đồng bộ thời gian thực.

## 🌟 Tổng quan dự án

Hệ thống **NoteFlow** được thiết kế theo kiến trúc Client - Server chuẩn hiện đại:

- **Android App (`Android/`)**: Ứng dụng Android Native viết bằng **Java (JDK 17)** theo mô hình **MVVM**, Material Design 3, tích hợp lưu trữ offline **Room Database**, nhập giọng nói tiếng Việt và đồng bộ thời gian thực với **Socket.IO**.
- **BackEnd (`BackEnd/`)**: RESTful API & Realtime Server xây dựng trên **Node.js + Express 5 + MySQL + Socket.IO**, xác thực bảo mật JWT Bearer Token, gửi email kích hoạt Nodemailer và tải ảnh Multer.

---

## 🛠️ Công nghệ sử dụng

### 1. Android Application (Native Java)
- **Ngôn ngữ:** Java (JDK 17)
- **Kiến trúc:** MVVM (Model - View - ViewModel) + Repository Pattern
- **Giao diện:** XML Layouts + ViewBinding + Google Material Components 3
- **Mạng (Networking):** Retrofit 2 + OkHttp 3 + Gson Converter
- **Cơ sở dữ liệu cục bộ (Local Cache):** Android Room Database (SQLite) + EncryptedSharedPreferences
- **Thời gian thực (Realtime):** Socket.IO Client Java (`io.socket:socket.io-client`)
- **Tải ảnh (Image Loading):** Glide 4
- **Giọng nói (Speech-to-Text):** Android Native `SpeechRecognizer` (Ngôn ngữ tiếng Việt `vi-VN`)

### 2. BackEnd Server
- **Nền tảng:** Node.js (v18+) + Express 5
- **Cơ sở dữ liệu:** MySQL 8 (mysql2)
- **Realtime:** Socket.IO Server
- **Bảo mật:** JSON Web Token (JWT), bcryptjs mã hóa mật khẩu
- **Xử lý tệp & Đa phương tiện:** Multer multipart/form-data
- **Dịch vụ Email:** Nodemailer SMTP (Kích hoạt tài khoản, đặt lại mật khẩu)

## Tính năng hiện có

- Đăng ký tài khoản bằng email
- Kích hoạt tài khoản qua email
- Đăng nhập / đăng xuất
- Quên mật khẩu và đặt lại mật khẩu
- Xem và cập nhật hồ sơ người dùng
- Đổi mật khẩu
- Tạo / sửa / xóa mềm / xóa vĩnh viễn ghi chú
- Khôi phục ghi chú từ thùng rác
- Auto-save khi chỉnh sửa
- Ghim ghi chú
- Tìm kiếm, lọc, sắp xếp ghi chú
- CRUD nhãn, gán nhãn vào ghi chú
- Bảo vệ ghi chú bằng mật khẩu
- Chia sẻ ghi chú qua link
- Upload ảnh cho ghi chú
- Đồng bộ realtime với Socket.IO
- Hàng đợi đồng bộ ngoại tuyến khi mất mạng

## Cấu trúc thư mục

```text
GIUA_KY/
├─ BackEnd/
│  ├─ src/
│  ├─ sql/
│  └─ uploads/
├─ FrontEnd/
│  ├─ src/
│  └─ public/
└─ README.md
```

## Yêu cầu môi trường

- Node.js >= 18
- npm >= 9
- MySQL >= 8

## Cài đặt và chạy dự án

### 1) Cài đặt BackEnd

```bash
cd BackEnd
npm install
```

Tạo file môi trường `BackEnd/.env` (có thể copy từ `.env.example` nếu có) và cấu hình các biến cần thiết như:

- `PORT` (ví dụ `4000`)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`
- `SMTP_*` (nếu dùng chức năng gửi email)
- `APP_URL`, `CLIENT_URL` (nếu cần cho luồng chia sẻ/kích hoạt)

Khởi chạy backend:

```bash
npm run dev
```

### 2) Cài đặt FrontEnd

```bash
cd FrontEnd
npm install
```

Tạo file `FrontEnd/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Khởi chạy frontend:

```bash
npm run dev
```

Mặc định frontend chạy tại `http://localhost:3000`.

## Cơ sở dữ liệu

1. Tạo database MySQL (ví dụ: `noteflow`).
2. Cấu hình đúng thông tin DB trong `BackEnd/.env`.
3. Import `BackEnd/sql/schema.sql` nếu bạn muốn khởi tạo thủ công.

## Ghi chú phát triển

- Realtime được xử lý qua Socket.IO giữa backend và frontend.
- Khi mất kết nối, frontend lưu tác vụ vào hàng đợi offline và tự đồng bộ lại khi online.
- Nếu cần kiểm tra nhanh:
  - Frontend: `npm run lint`, `npm run build`
  - Backend: `npm run dev` để test runtime API

## Hướng mở rộng đề xuất

- Thêm endpoint lấy chi tiết 1 ghi chú (`GET /notes/:id`) để tối ưu đồng bộ khi mở note.
- Thêm test tự động (unit/integration) cho luồng auth và notes.
- Chuẩn hóa logging + observability cho realtime events.
