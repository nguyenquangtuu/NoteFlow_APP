package com.noteflow.app.realtime;

import android.util.Log;
import com.google.gson.Gson;
import com.noteflow.app.NoteFlowApp;
import com.noteflow.app.data.model.Note;
import com.noteflow.app.data.session.SessionManager;
import com.noteflow.app.utils.Constants;
import com.noteflow.app.utils.NotificationHelper;

import org.json.JSONObject;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import io.socket.client.IO;
import io.socket.client.Socket;

public class SocketManager {

    private static final String TAG = "SocketManager";
    private static SocketManager instance;
    private Socket socket;
    private final List<SocketEventListener> listeners = Collections.synchronizedList(new ArrayList<>());
    private final Gson gson = new Gson();

    public interface SocketEventListener {
        void onNoteUpdated(Note note, String updatedBy);
        void onNoteShared(String noteId, String title, String sharedBy, String permission);
    }

    public static synchronized SocketManager getInstance() {
        if (instance == null) {
            instance = new SocketManager();
        }
        return instance;
    }

    public void addListener(SocketEventListener listener) {
        if (!listeners.contains(listener)) {
            listeners.add(listener);
        }
    }

    public void removeListener(SocketEventListener listener) {
        listeners.remove(listener);
    }

    public void connect() {
        SessionManager sessionManager = new SessionManager(NoteFlowApp.getInstance());
        String userId = sessionManager.getUserId();

        if (userId == null || userId.isEmpty()) {
            return;
        }

        try {
            if (socket != null && socket.connected()) {
                return;
            }

            IO.Options options = new IO.Options();
            options.query = "userId=" + userId;
            options.reconnection = true;
            options.reconnectionAttempts = 10;
            options.reconnectionDelay = 2000;

            socket = IO.socket(URI.create(Constants.SOCKET_URL), options);

            socket.on(Socket.EVENT_CONNECT, args -> Log.d(TAG, "Socket connected: " + socket.id()));
            socket.on(Socket.EVENT_CONNECT_ERROR, args -> Log.e(TAG, "Socket connect error: " + (args.length > 0 ? args[0] : "")));
            socket.on(Socket.EVENT_DISCONNECT, args -> Log.d(TAG, "Socket disconnected"));

            // Listen for note_updated
            socket.on("note_updated", args -> {
                if (args != null && args.length > 0) {
                    try {
                        JSONObject data = (JSONObject) args[0];
                        String updatedBy = data.optString("updatedBy", "");
                        JSONObject noteObj = data.optJSONObject("note");
                        if (noteObj != null) {
                            Note note = gson.fromJson(noteObj.toString(), Note.class);
                            for (SocketEventListener listener : listeners) {
                                listener.onNoteUpdated(note, updatedBy);
                            }
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Error parsing note_updated event", e);
                    }
                }
            });

            // Listen for note_shared
            socket.on("note_shared", args -> {
                if (args != null && args.length > 0) {
                    try {
                        JSONObject data = (JSONObject) args[0];
                        String noteId = data.optString("noteId", "");
                        String title = data.optString("title", "Ghi chú mới");
                        String sharedBy = data.optString("sharedBy", "Người dùng");
                        String permission = data.optString("permission", "viewer");

                        // Trigger push notification on device
                        NotificationHelper.showNotification(
                                NoteFlowApp.getInstance(),
                                "Ghi chú được chia sẻ",
                                sharedBy + " đã chia sẻ ghi chú \"" + title + "\" với bạn."
                        );

                        for (SocketEventListener listener : listeners) {
                            listener.onNoteShared(noteId, title, sharedBy, permission);
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Error parsing note_shared event", e);
                    }
                }
            });

            socket.connect();
        } catch (Exception e) {
            Log.e(TAG, "Failed to initialize socket", e);
        }
    }

    public void disconnect() {
        if (socket != null) {
            socket.disconnect();
            socket.off();
            socket = null;
        }
    }
}
