# NoteFlow - Hướng dẫn chạy dự án

Repository: [https://github.com/nguyenquangtuu/NoteFlow_APP.git](https://github.com/nguyenquangtuu/NoteFlow_APP.git)

---

## 1. Yêu cầu môi trường
* **Git**
* **Node.js** (v18 trở lên) & **npm**
* **Docker** (khuyên dùng để chạy nhanh Database MySQL) hoặc MySQL 8.0 cài trực tiếp trên máy
* **Android Studio** (bản Iguana / Jellyfish / Koala trở lên, JDK 17 tích hợp sẵn)

---

## 2. Clone dự án

```bash
git clone https://github.com/nguyenquangtuu/NoteFlow_APP.git
cd NoteFlow_APP
```

---

## 3. Khởi chạy Backend Server

### Cách 1: Dùng Docker cho Database + chạy Node.js máy host (Khuyên dùng)

1. Mở terminal tại thư mục gốc:
   ```bash
   # Khởi động container MySQL 8.0 (đã tích hợp sẵn tạo database và nạp schema.sql)
   docker compose up -d mysql
   ```

2. Cài đặt thư viện và khởi động server Backend:
   ```bash
   cd BackEnd
   npm install

   # Tạo file .env nếu chưa có
   cp .env.example .env

   # Chạy server ở chế độ dev
   npm run dev
   ```
   Server sẽ lắng nghe tại: `http://localhost:4000`

### Cách 2: Chạy toàn bộ Backend & DB bằng Docker

```bash
docker compose up --build -d
```
* Xem log: `docker compose logs -f`
* Dừng: `docker compose down`

### Cách 3: Chạy với MySQL cài trực tiếp trên máy (không dùng Docker)
1. Tạo database tên `noteflow` trong MySQL.
2. Import file schema: `BackEnd/sql/schema.sql`.
3. Cập nhật thông tin `DB_USER` và `DB_PASSWORD` trong file `BackEnd/.env`.
4. Chạy:
   ```bash
   cd BackEnd
   npm install
   npm run dev
   ```

---

## 4. Chạy ứng dụng Android

1. Mở **Android Studio**.
2. Chọn **Open** và trỏ đến thư mục `Android` trong repository (`NoteFlow_APP/Android`).
3. Chờ Android Studio đồng bộ Gradle (Gradle Sync).
4. Kiểm tra cấu hình địa chỉ máy chủ trong file:
   `app/src/main/java/com/noteflow/app/utils/Constants.java`
   * **Nếu chạy trên Android Emulator (máy ảo):** Mặc định đã là `http://10.0.2.2:4000` (giữ nguyên).
   * **Nếu chạy trên điện thoại thật:** Đổi thành địa chỉ IPv4 máy tính của bạn (ví dụ `http://192.168.1.x:4000`, điện thoại và máy tính kết nối chung WiFi).
5. Chọn thiết bị chạy (máy ảo Pixel/Nexus hoặc máy thật) rồi nhấn **Run 'app'** (`Shift + F10`).
