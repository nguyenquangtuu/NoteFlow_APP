package com.noteflow.app.utils;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.noteflow.app.NoteFlowApp;
import com.noteflow.app.R;
import com.noteflow.app.ui.main.MainActivity;

public class NotificationHelper {

    public static void showNotification(Context context, String title, String message) {
        try {
            Intent intent = new Intent(context, MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            PendingIntent pendingIntent = PendingIntent.getActivity(
                    context,
                    0,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, NoteFlowApp.CHANNEL_NOTIFICATIONS)
                    .setSmallIcon(R.drawable.ic_notes)
                    .setContentTitle(title)
                    .setContentText(message)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setContentIntent(pendingIntent)
                    .setAutoCancel(true);

            NotificationManagerCompat manager = NotificationManagerCompat.from(context);
            manager.notify((int) System.currentTimeMillis(), builder.build());
        } catch (SecurityException se) {
            // Permission POST_NOTIFICATIONS missing on Android 13+
        } catch (Exception ignored) {}
    }
}
