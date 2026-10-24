package com.noteflow.app.ui.profile;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.noteflow.app.data.model.User;
import com.noteflow.app.data.model.response.ApiResponse;
import com.noteflow.app.data.model.response.UserResponse;
import com.noteflow.app.data.repository.AuthRepository;

import java.util.HashMap;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProfileViewModel extends ViewModel {

    private final AuthRepository authRepository;

    private final MutableLiveData<User> userProfile = new MutableLiveData<>();
    private final MutableLiveData<String> message = new MutableLiveData<>();
    private final MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);

    public ProfileViewModel() {
        this.authRepository = new AuthRepository();
    }

    public LiveData<User> getUserProfile() { return userProfile; }
    public LiveData<String> getMessage() { return message; }
    public LiveData<Boolean> getIsLoading() { return isLoading; }

    public void loadProfile() {
        isLoading.setValue(true);
        authRepository.getProfile(new Callback<UserResponse>() {
            @Override
            public void onResponse(Call<UserResponse> call, Response<UserResponse> response) {
                isLoading.setValue(false);
                if (response.isSuccessful() && response.body() != null && response.body().getUser() != null) {
                    userProfile.setValue(response.body().getUser());
                }
            }

            @Override
            public void onFailure(Call<UserResponse> call, Throwable t) {
                isLoading.setValue(false);
                message.setValue("Không thể tải thông tin hồ sơ.");
            }
        });
    }

    public void updateFullName(String fullName) {
        if (fullName.trim().isEmpty()) {
            message.setValue("Họ tên không được để trống.");
            return;
        }

        isLoading.setValue(true);
        Map<String, Object> prefs = new HashMap<>();
        authRepository.updateProfile(fullName.trim(), prefs, new Callback<UserResponse>() {
            @Override
            public void onResponse(Call<UserResponse> call, Response<UserResponse> response) {
                isLoading.setValue(false);
                if (response.isSuccessful() && response.body() != null) {
                    userProfile.setValue(response.body().getUser());
                    message.setValue("Đã lưu thông tin cá nhân!");
                } else {
                    message.setValue("Lỗi cập nhật thông tin.");
                }
            }

            @Override
            public void onFailure(Call<UserResponse> call, Throwable t) {
                isLoading.setValue(false);
                message.setValue("Lỗi kết nối máy chủ.");
            }
        });
    }

    public void changePassword(String currentPassword, String newPassword) {
        if (currentPassword.isEmpty() || newPassword.isEmpty()) {
            message.setValue("Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.");
            return;
        }

        isLoading.setValue(true);
        authRepository.changePassword(currentPassword, newPassword, new Callback<ApiResponse>() {
            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                isLoading.setValue(false);
                if (response.isSuccessful()) {
                    message.setValue("Đổi mật khẩu tài khoản thành công!");
                } else {
                    message.setValue("Mật khẩu hiện tại không chính xác.");
                }
            }

            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                isLoading.setValue(false);
                message.setValue("Lỗi kết nối máy chủ.");
            }
        });
    }
}
