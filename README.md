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

## ✨ Tính năng chi tiết của hệ thống

| Nhóm chức năng | Chi tiết tính năng trên Android App |
| :--- | :--- |
| **Xác thực (Auth)** | • Đăng ký tài khoản mới kèm xác nhận mật khẩu.<br>• Kích hoạt tài khoản qua liên kết email.<br>• Đăng nhập bảo mật JWT, duy trì phiên làm việc.<br>• Quên mật khẩu và đặt lại mật khẩu mới qua email.<br>• Đăng xuất tài khoản an toàn. |
| **Quản lý Ghi chú (CRUD)** | • Tạo mới ghi chú (tiêu đề, nội dung, ngày tạo).<br>• **Auto-save:** Tự động lưu sau 800ms khi dừng gõ.<br>• Chế độ hiển thị: **Lưới (Staggered Grid)** hoặc **Dòng (List)**.<br>• Sắp xếp theo: **Mới nhất** $\leftrightarrow$ **Cũ nhất**.<br>• Ghim ghi chú ưu tiên lên đầu danh sách.<br>• **Thùng rác:** Xóa mềm, Khôi phục ghi chú, Xóa vĩnh viễn.<br>• Tìm kiếm tức thì theo từ khóa trong tiêu đề và nội dung.<br>• Lọc theo ngày cụ thể (DatePicker) hoặc xem tất cả các ngày. |
| **Nội dung & Đa phương tiện** | • Hỗ trợ Checklist (phím tắt chèn `[ ] `).<br>• **Nhập giọng nói tiếng Việt:** Chuyển giọng nói thành văn bản nối tiếp vào nội dung.<br>• **Đính kèm ảnh:** Chọn ảnh từ thư viện/máy ảnh, tải lên server và xem ảnh phóng to. |
| **Bảo vệ Mật khẩu (Note Lock)** | • Khóa riêng từng ghi chú bằng mật khẩu.<br>• Hộp thoại xác thực mật khẩu để mở khóa xem nội dung.<br>• Thiết lập mật khẩu, đổi mật khẩu và hủy khóa bảo vệ. |
| **Nhãn (Labels)** | • CRUD Nhãn: Tạo mới, đổi tên, chọn màu sắc từ bảng màu và xóa nhãn.<br>• Gán hoặc gỡ nhiều nhãn cho từng ghi chú.<br>• Lọc nhanh danh sách ghi chú theo từng nhãn từ Navigation Drawer. |
| **Chia sẻ & Cộng tác** | • Tạo liên kết chia sẻ công khai (`share_token`) kèm nút sao chép link.<br>• Mời cộng tác viên qua Email với phân quyền **Chỉ xem (Viewer)** hoặc **Được sửa (Editor)**.<br>• Quản lý danh sách người dùng được chia sẻ và thu hồi quyền.<br>• Mục xem riêng các ghi chú **"Đã chia sẻ với tôi"**. |
| **Realtime & Ngoại tuyến** | • Đồng bộ Socket.IO: Nhận cập nhật ghi chú ngay lập tức (`note_updated`).<br>• Nhận thông báo hệ thống khi được người khác chia sẻ ghi chú (`note_shared`).<br>• Lưu trữ Room Database cục bộ, xem và chỉnh sửa ghi chú khi mất mạng. |
| **Hồ sơ & Giao diện** | • Cập nhật họ tên người dùng.<br>• Đổi mật khẩu tài khoản.<br>• Chuyển đổi giao diện **Sáng / Tối (Light / Dark Mode)** tức thì. |

## Cấu trúc thư mục

```text
NoteFlow/
├── Android/                                      # Mã nguồn ứng dụng Android Native (Java)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/noteflow/app/
│   │   │   │   ├── data/                         # Tầng Data: Api, Local (Room DB), Models, Repositories
│   │   │   │   ├── realtime/                     # SocketManager (Socket.IO client)
│   │   │   │   ├── ui/                           # Tầng Giao diện (Auth, Main, Editor, Dialogs, Profile)
│   │   │   │   └── utils/                        # Tiện ích: Constants, DateTimeUtils, NotificationHelper
│   │   │   ├── res/                              # Layouts XML, Drawables, Values (Colors, Strings, Themes)
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   ├── build.gradle
│   └── settings.gradle
├── BackEnd/                                      # Mã nguồn máy chủ Node.js + Express
│   ├── src/
│   │   ├── config/                               # Cấu hình Database & Mailer
│   │   ├── middleware/                           # Auth Middleware JWT
│   │   ├── routes/                               # Auth, Users, Notes, Labels, Notifications
│   │   └── index.js
│   ├── sql/schema.sql                            # Schema cơ sở dữ liệu MySQL
│   └── package.json
└── README.md
```

---

## 👨‍💻 Tác giả & Giấy phép
- **Tác giả:** Nguyen Quang Tuu ([@nguyenquangtuu](https://github.com/nguyenquangtuu))
- **Dự án:** NoteFlow - Ứng dụng ghi chú thông minh đa nền tảng.
- **Giấy phép:** MIT License.

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

## 📱 Cài đặt và Chạy Ứng Dụng Android

### 1) Yêu cầu môi trường
- **Android Studio:** Phiên bản Iguana / Jellyfish / Koala / Ladybug hoặc mới hơn.
- **JDK:** Java 17 (mặc định tích hợp sẵn trong Android Studio).
- **Android SDK:** Compile SDK 34, Min SDK 26 (Android 8.0 trở lên).

### 2) Mở Project trong Android Studio
1. Mở Android Studio, chọn **Open** (hoặc **File > Open**).
2. Duyệt đến thư mục `Android` trong repository (`.../NoteFlow/Android`) và nhấn **OK**.
3. Chờ Android Studio và Gradle tải các gói phụ thuộc và hoàn tất quá trình Sync.

### 3) Cấu hình địa chỉ IP kết nối Backend
Mở file [Constants.java](file:///Android/app/src/main/java/com/noteflow/app/utils/Constants.java):
```java
// Khi chạy trên máy ảo Android Emulator:
public static final String SERVER_HOST = "http://10.0.2.2:4000";

// Khi chạy trên thiết bị thật (cắm cáp USB hoặc chung WiFi với máy tính):
// Thay bằng IPv4 của máy tính (xem bằng lệnh ipconfig trong cmd):
// public static final String SERVER_HOST = "http://192.168.1.xxx:4000";
```

### 4) Cài đặt & Khởi chạy BackEnd Server
```bash
cd BackEnd
npm install
npm run dev
```

### 5) Chạy Ứng dụng Android
- Chọn thiết bị máy ảo hoặc thiết bị thật trên thanh công cụ Android Studio.
- Nhấn nút **Run 'app'** (phím tắt `Shift + F10`) để build và khởi chạy ứng dụng NoteFlow.

## Cơ sở dữ liệu

1. Tạo database MySQL (ví dụ: `noteflow`).
2. Cấu hình đúng thông tin DB trong `BackEnd/.env`.
3. Import `BackEnd/sql/schema.sql` nếu bạn muốn khởi tạo thủ công.

## 🌐 Hệ thống API & Realtime Socket.IO

### 1) RESTful API Endpoints (`/api`)
* **Xác thực (`/auth`):**
  * `POST /auth/register`: Đăng ký tài khoản (`fullName`, `email`, `password`, `confirmPassword`).
  * `POST /auth/login`: Đăng nhập hệ thống $\rightarrow$ nhận JWT Token.
  * `POST /auth/activate`: Kích hoạt tài khoản bằng mã gửi qua email.
  * `POST /auth/forgot-password` & `POST /auth/reset-password`: Quên và đặt lại mật khẩu.
  * `POST /auth/change-password`: Đổi mật khẩu tài khoản (Header `Authorization`).
* **Quản lý Hồ sơ (`/users`):**
  * `GET /users/profile`: Lấy thông tin cá nhân và preferences.
  * `PUT /users/profile`: Cập nhật họ tên, giao diện sáng/tối.
* **Quản lý Nhãn (`/labels`):**
  * `GET /labels`: Lấy danh sách nhãn kèm số lượng ghi chú.
  * `POST /labels`: Tạo nhãn mới (`name`, mã màu `color`).
  * `PUT /labels/:id`: Cập nhật tên và màu sắc của nhãn.
  * `DELETE /labels/:id`: Xóa nhãn.
* **Quản lý Ghi chú (`/notes`):**
  * `GET /notes`: Lấy danh sách ghi chú (hỗ trợ lọc theo `date`, `search`, `labelId`, `includeDeleted`, `sharedWithMe`).
  * `POST /notes`: Tạo ghi chú mới (`title`, `content`, `noteDate`, `labelIds`, `notePassword`).
  * `PUT /notes/:id`: Cập nhật ghi chú và auto-save.
  * `DELETE /notes/:id`: Chuyển ghi chú vào thùng rác.
  * `DELETE /notes/:id/permanent`: Xóa vĩnh viễn ghi chú.
  * `POST /notes/:id/password/verify`: Mở khóa ghi chú được bảo vệ.
  * `POST /notes/:id/password/enable`: Thiết lập mật khẩu cho ghi chú.
  * `PUT /notes/:id/password`: Đổi mật khẩu bảo vệ ghi chú.
  * `POST /notes/:id/password/disable`: Hủy bảo vệ mật khẩu ghi chú.
  * `POST /notes/:id/images`: Tải ảnh đính kèm (Multipart upload).
  * `POST /notes/:id/share`: Tạo link chia sẻ công khai.
  * `GET /notes/:id/shares`: Xem danh sách phân quyền chia sẻ.
  * `PUT /notes/:id/shares/public`: Cập nhật quyền công khai (`viewer`, `editor`, `none`).
  * `POST /notes/:id/shares/user`: Mời người dùng qua email với quyền tương ứng.
  * `DELETE /notes/:id/shares/user/:email`: Thu hồi quyền truy cập của người dùng.

### 2) Sự kiện Realtime (Socket.IO)
* Kết nối: `http://<SERVER_HOST>:4000?userId=<USER_ID>`
* Room cá nhân: `user_${userId}`
* Sự kiện lắng nghe:
  * `note_updated`: Cập nhật ghi chú tức thì trên giao diện khi có chỉnh sửa.
  * `note_shared`: Nhận thông báo hệ thống khi được người khác chia sẻ ghi chú mới.
