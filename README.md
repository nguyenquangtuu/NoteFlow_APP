# NoteFlow

Ứng dụng ghi chú theo ngày, hỗ trợ tiếng Việt, chia sẻ cộng tác và đồng bộ thời gian thực.

## Tổng quan

Repository này gồm 2 phần chính:

- **FrontEnd**: Next.js + TypeScript (giao diện người dùng)
- **BackEnd**: Node.js + Express + Socket.IO + MySQL (API, xác thực, realtime)

## Công nghệ sử dụng

### FrontEnd
- Next.js 16
- React 19
- TypeScript
- socket.io-client
- dayjs
- lucide-react

### BackEnd
- Node.js + Express 5
- MySQL (mysql2)
- Socket.IO
- JWT (jsonwebtoken)
- bcryptjs
- nodemailer
- multer

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
