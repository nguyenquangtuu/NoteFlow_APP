package com.noteflow.app;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import androidx.appcompat.app.AppCompatDelegate;

import com.noteflow.app.data.session.SessionManager;

public class NoteFlowApp extends Application {

    public static final String CHANNEL_NOTIFICATIONS = "noteflow_channel_notifications";
    private static NoteFlowApp instance;

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;

        // Apply saved theme
        SessionManager sessionManager = new SessionManager(this);
        String theme = sessionManager.getTheme();
        if ("dark".equalsIgnoreCase(theme)) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        } else if ("light".equalsIgnoreCase(theme)) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
        }

        createNotificationChannel();
    }

    public static NoteFlowApp getInstance() {
        return instance;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_NOTIFICATIONS,
                    "NoteFlow Thông báo",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            channel.setDescription("Thông báo cập nhật và chia sẻ ghi chú");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
}
