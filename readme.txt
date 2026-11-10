HUONG DAN CHAY DU AN NOTEFLOW

I. THONG TIN CHUNG
- De tai: Xay dung he thong quan ly nhat ky theo thoi gian thuc - NoteFlow
- Sinh vien thuc hien:
  + Ngo Tan Thanh - MSSV: 524H0031
  + Nguyen Quang Tuu - MSSV: 524H0136
- Repository: https://github.com/nguyenquangtuu/NoteFlow_APP.git

II. CONG CU CAN CO TREN MAY
1. Git
2. Docker Desktop (dang bat)
3. Android Studio (da tao san 1 may ao Android Emulator)

III. THU TU THUC THI DU AN

Buoc 1: Tai ma nguon ve may
- Vi tri: Mo Terminal tai thu muc muon luu du an tren may tinh.
- Thao tac: Chay lenh:
    git clone https://github.com/nguyenquangtuu/NoteFlow_APP.git
    cd NoteFlow_APP

Buoc 2: Khoi chay Backend va Co so du lieu
- Vi tri: Tai thu muc goc cua du an (NoteFlow_APP/).
- Thao tac: Chay lenh:
    docker compose up --build -d
  Lenh nay tu dong khoi dong MySQL 8.0, tao database noteflow, nap du lieu mau va chay server tai cong 4000.
- Kiem tra: Mo trinh duyet truy cap http://localhost:4000/api/notes de kiem tra server hoat dong.

Buoc 3: Khoi chay ung dung Android
- Vi tri: Mo phan mem Android Studio.
- Thao tac:
  1. Chon Open > Chon thu muc Android ben trong du an (NoteFlow_APP/Android).
  2. Cho Android Studio dong bo Gradle xong.
  3. Bat may ao Android Emulator tren Android Studio.
  4. Nhan nut Run tren thanh cong cu (phim tat Shift + F10) de cai dat va mo app.

IV. TAI KHOAN DANG NHAP KIEM THU TREN APP
Sau khi mo ung dung tren may ao, dang nhap bang tai khoan co san:
- Tai khoan chu so huu:
  + Email: thanh524h0031@student.tdtu.edu.vn
  + Mat khau: 12345678
- Tai khoan cong tac vien:
  + Email: tuu524h0136@student.tdtu.edu.vn
  + Mat khau: 12345678
- Mat khau mo khoa trang ghi chu bao ve: 123456

V. TAT HE THONG SAU KHI CHAM
- Vi tri: Mo Terminal tai thu muc goc du an (NoteFlow_APP/).
- Thao tac: Chay lenh:
    docker compose down
