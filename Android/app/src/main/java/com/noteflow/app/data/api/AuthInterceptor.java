package com.noteflow.app.data.api;

import androidx.annotation.NonNull;
import com.noteflow.app.NoteFlowApp;
import com.noteflow.app.data.session.SessionManager;

import java.io.IOException;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class AuthInterceptor implements Interceptor {

    private final SessionManager sessionManager;

    public AuthInterceptor() {
        this.sessionManager = new SessionManager(NoteFlowApp.getInstance());
    }

    @NonNull
    @Override
    public Response intercept(@NonNull Chain chain) throws IOException {
        Request originalRequest = chain.request();
        Request.Builder builder = originalRequest.newBuilder()
                .header("Accept", "application/json");

        String token = sessionManager.getToken();
        if (token != null && !token.isEmpty()) {
            builder.header("Authorization", "Bearer " + token);
        }

        return chain.proceed(builder.build());
    }
}
