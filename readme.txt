NOTEFLOW - HUONG DAN CHAY DU AN

Repository: https://github.com/nguyenquangtuu/NoteFlow_APP.git

1. Thong tin nhom
- Ngo Tan Thanh - MSSV: 524H0031
- Nguyen Quang Tuu - MSSV: 524H0136

2. Tai khoan dang nhap thu nghiem
- Chu so huu: thanh524h0031@student.tdtu.edu.vn / Mat khau: 12345678
- Cong tac vien: tuu524h0136@student.tdtu.edu.vn / Mat khau: 12345678
- Mat khau mo khoa ghi chu: 123456

QUY TRINH 2 BUOC KHOI CHAY TOAN BO DU AN:

Buoc 1: Dung Backend va Database bang 1 lenh Docker duy nhat
Mo Terminal tai thu muc goc du an va chay:

    docker compose up --build -d

Lenh nay tu dong khoi dung:
- MySQL 8.0 tao database noteflow, nap schema.sql va seed.sql co san tai khoan va du lieu thu nghiem.
- Backend Node.js ket noi database va lang nghe tai http://localhost:4000.

Kiem tra Backend hoat dong: mo trinh duyet vao http://localhost:4000/api/notes
Dung he thong khi cham xong: docker compose down

Buoc 2: Chay ung dung Android
Co 2 lua chon chay:

Lua chon A: Chay bang dong lenh Terminal
Yeu cau: May tinh da bat may ao Android hoac cam cap dien thoai Android.

    cd Android
    .\gradlew.bat installDebug
    adb shell am start -n com.noteflow.app/.ui.main.MainActivity

Lua chon B: Chay bang Android Studio
- Mo Android Studio, chon Open va tro vao thu muc Android.
- Nhan nut Run de khoi chay len may ao hoac dien thoai.

Ghi chu dia chi IP ket noi:
- May ao Android: mac dinh tro ve http://10.0.2.2:4000, khong can chinh sua gi.
- Dien thoai that: sua SERVER_HOST tai Android/app/src/main/java/com/noteflow/app/utils/Constants.java thanh dia chi IP may tinh trong cung mang WiFi.
