NOTEFLOW - HUONG DAN CHAY DU AN

Repository: https://github.com/nguyenquangtuu/NoteFlow_APP.git

1. Thong tin nhom
- Ngo Tan Thanh - MSSV: 524H0031
- Nguyen Quang Tuu - MSSV: 524H0136

2. Tai khoan dang nhap
- Tai khoan 1: thanh524h0031@student.tdtu.edu.vn / Mat khau: 12345678
- Tai khoan 2: tuu524h0136@student.tdtu.edu.vn / Mat khau: 12345678
- Mat khau mo khoa ghi chu: 123456

3. Chay Backend va Database
Yeu cau: Node.js 18 tro len, Docker hoac MySQL 8.0.

Cach 1: Dung Docker cho Database va chay Node.js truc tiep
- Buoc 1: Bat container MySQL:
    docker compose up -d mysql

- Buoc 2: Chay Backend:
    cd BackEnd
    npm install
    npm run dev
    Server lang nghe tai cong 4000.

Cach 2: Chay toan bo qua Docker
    docker compose up --build -d

Cach 3: Dung MySQL cai tren may
- Tao database noteflow trong MySQL.
- Import file schema: BackEnd/sql/schema.sql
- Dien user va password vao BackEnd/.env
- Chay: cd BackEnd && npm install && npm run dev

4. Chay ung dung Android
Yeu cau: Android SDK va may ao hoac dien thoai Android.

Cach 1: Chay bang dong lenh
- Build file APK:
    cd Android
    .\gradlew.bat assembleDebug
- Cai va mo ung dung len thiet bi:
    .\gradlew.bat installDebug
    adb shell am start -n com.noteflow.app/.ui.main.MainActivity

Cach 2: Chay bang Android Studio
- Mo Android Studio, chon thu muc Android.
- Kiem tra dia chi may chu tai file:
  Android/app/src/main/java/com/noteflow/app/utils/Constants.java
  May ao de nguyen http://10.0.2.2:4000
  Dien thoai that doi thanh dia chi IP may tinh cung mang WiFi.
- Nhan Run de khoi chay.
