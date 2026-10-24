package com.noteflow.app.data.repository;

import com.noteflow.app.data.api.ApiService;
import com.noteflow.app.data.api.RetrofitClient;
import com.noteflow.app.data.model.request.LoginRequest;
import com.noteflow.app.data.model.request.RegisterRequest;
import com.noteflow.app.data.model.response.ApiResponse;
import com.noteflow.app.data.model.response.AuthResponse;
import com.noteflow.app.data.model.response.UserResponse;

import java.util.HashMap;
import java.util.Map;
import retrofit2.Call;
import retrofit2.Callback;

public class AuthRepository {

    private final ApiService apiService;

    public AuthRepository() {
        this.apiService = RetrofitClient.getInstance();
    }

    public void login(String email, String password, Callback<AuthResponse> callback) {
        apiService.login(new LoginRequest(email, password)).enqueue(callback);
    }

    public void register(String fullName, String email, String password, String confirmPassword, Callback<AuthResponse> callback) {
        apiService.register(new RegisterRequest(fullName, email, password, confirmPassword)).enqueue(callback);
    }

    public void forgotPassword(String email, Callback<ApiResponse> callback) {
        Map<String, String> body = new HashMap<>();
        body.put("email", email);
        apiService.forgotPassword(body).enqueue(callback);
    }

    public void resetPassword(String token, String password, Callback<ApiResponse> callback) {
        Map<String, String> body = new HashMap<>();
        body.put("token", token);
        body.put("password", password);
        apiService.resetPassword(body).enqueue(callback);
    }

    public void changePassword(String currentPassword, String newPassword, Callback<ApiResponse> callback) {
        Map<String, String> body = new HashMap<>();
        body.put("currentPassword", currentPassword);
        body.put("newPassword", newPassword);
        apiService.changePassword(body).enqueue(callback);
    }

    public void getProfile(Callback<UserResponse> callback) {
        apiService.getProfile().enqueue(callback);
    }

    public void updateProfile(String fullName, Map<String, Object> preferences, Callback<UserResponse> callback) {
        Map<String, Object> body = new HashMap<>();
        if (fullName != null) body.put("fullName", fullName);
        if (preferences != null) body.put("preferences", preferences);
        apiService.updateProfile(body).enqueue(callback);
    }
}
