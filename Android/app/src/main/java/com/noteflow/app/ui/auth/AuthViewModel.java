package com.noteflow.app.ui.auth;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.noteflow.app.data.model.response.ApiResponse;
import com.noteflow.app.data.model.response.AuthResponse;
import com.noteflow.app.data.repository.AuthRepository;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AuthViewModel extends ViewModel {

    private final AuthRepository authRepository;

    private final MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    private final MutableLiveData<AuthResponse> loginResult = new MutableLiveData<>();
    private final MutableLiveData<AuthResponse> registerResult = new MutableLiveData<>();
    private final MutableLiveData<String> forgotPasswordSuccess = new MutableLiveData<>();

    public AuthViewModel() {
        this.authRepository = new AuthRepository();
    }

    public LiveData<Boolean> getIsLoading() { return isLoading; }
    public LiveData<String> getErrorMessage() { return errorMessage; }
    public LiveData<AuthResponse> getLoginResult() { return loginResult; }
    public LiveData<AuthResponse> getRegisterResult() { return registerResult; }
    public LiveData<String> getForgotPasswordSuccess() { return forgotPasswordSuccess; }

    public void login(String email, String password) {
        if (email.trim().isEmpty() || password.isEmpty()) {
            errorMessage.setValue("Vui lòng nhập email và mật khẩu.");
            return;
        }

        isLoading.setValue(true);
        authRepository.login(email.trim(), password, new Callback<AuthResponse>() {
            @Override
            public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                isLoading.setValue(false);
                if (response.isSuccessful() && response.body() != null) {
                    loginResult.setValue(response.body());
                } else {
                    errorMessage.setValue(response.body() != null && response.body().getMessage() != null
                            ? response.body().getMessage()
                            : "Email hoặc mật khẩu không chính xác.");
                }
            }

            @Override
            public void onFailure(Call<AuthResponse> call, Throwable t) {
                isLoading.setValue(false);
                errorMessage.setValue("Lỗi kết nối máy chủ: " + t.getMessage());
            }
        });
    }

    public void register(String fullName, String email, String password, String confirmPassword) {
        if (fullName.trim().isEmpty() || email.trim().isEmpty() || password.isEmpty() || confirmPassword.isEmpty()) {
            errorMessage.setValue("Vui lòng điền đầy đủ các thông tin.");
            return;
        }
        if (!password.equals(confirmPassword)) {
            errorMessage.setValue("Mật khẩu xác nhận không trùng khớp.");
            return;
        }

        isLoading.setValue(true);
        authRepository.register(fullName.trim(), email.trim(), password, confirmPassword, new Callback<AuthResponse>() {
            @Override
            public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                isLoading.setValue(false);
                if (response.isSuccessful() && response.body() != null) {
                    registerResult.setValue(response.body());
                } else {
                    errorMessage.setValue(response.body() != null && response.body().getMessage() != null
                            ? response.body().getMessage()
                            : "Không thể đăng ký. Email có thể đã được sử dụng.");
                }
            }

            @Override
            public void onFailure(Call<AuthResponse> call, Throwable t) {
                isLoading.setValue(false);
                errorMessage.setValue("Lỗi kết nối máy chủ: " + t.getMessage());
            }
        });
    }

    public void forgotPassword(String email) {
        if (email.trim().isEmpty()) {
            errorMessage.setValue("Vui lòng nhập địa chỉ email.");
            return;
        }

        isLoading.setValue(true);
        authRepository.forgotPassword(email.trim(), new Callback<ApiResponse>() {
            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                isLoading.setValue(false);
                if (response.isSuccessful() && response.body() != null) {
                    forgotPasswordSuccess.setValue(response.body().getMessage());
                } else {
                    errorMessage.setValue("Không thể xử lý yêu cầu đặt lại mật khẩu.");
                }
            }

            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                isLoading.setValue(false);
                errorMessage.setValue("Lỗi kết nối máy chủ: " + t.getMessage());
            }
        });
    }
}
