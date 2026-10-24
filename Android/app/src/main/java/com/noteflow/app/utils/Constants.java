package com.noteflow.app.utils;

public class Constants {
    // 10.0.2.2 trỏ về localhost của máy tính khi dùng Android Emulator
    // Nếu chạy trên điện thoại thật cắm cáp/WiFi, thay bằng IP máy tính (ví dụ: http://192.168.1.5:4000)
    public static final String SERVER_HOST = "http://10.0.2.2:4000";
    public static final String BASE_URL = SERVER_HOST + "/api/";
    public static final String UPLOADS_URL = SERVER_HOST + "/uploads/";
    public static final String SOCKET_URL = SERVER_HOST;

    // Preferences Keys
    public static final String PREF_NAME = "noteflow_prefs";
    public static final String KEY_TOKEN = "key_jwt_token";
    public static final String KEY_USER_ID = "key_user_id";
    public static final String KEY_USER_NAME = "key_user_name";
    public static final String KEY_USER_EMAIL = "key_user_email";
    public static final String KEY_USER_AVATAR = "key_user_avatar";
    public static final String KEY_THEME = "key_theme";
    public static final String KEY_VIEW_MODE = "key_view_mode"; // "grid" | "list"
    public static final String KEY_IS_ACTIVE = "key_is_active";

    // Intent Extras
    public static final String EXTRA_NOTE_ID = "extra_note_id";
    public static final String EXTRA_IS_READ_ONLY = "extra_is_read_only";
    public static final String EXTRA_NOTE_DATE = "extra_note_date";
    public static final String EXTRA_NOTE_PASSWORD = "extra_note_password";
}
