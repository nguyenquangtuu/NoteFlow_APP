package com.noteflow.app.ui.dialogs;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.noteflow.app.databinding.DialogNotePasswordBinding;

public class NotePasswordDialog extends Dialog {

    public enum Mode {
        UNLOCK, ENABLE, CHANGE, DISABLE
    }

    public interface OnPasswordActionListener {
        void onUnlock(String password);
        void onEnable(String password, String confirmPassword);
        void onChange(String currentPassword, String newPassword, String confirmNewPassword);
        void onDisable(String currentPassword);
    }

    private final Mode mode;
    private final OnPasswordActionListener listener;
    private DialogNotePasswordBinding binding;

    public NotePasswordDialog(@NonNull Context context, Mode mode, OnPasswordActionListener listener) {
        super(context);
        this.mode = mode;
        this.listener = listener;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        binding = DialogNotePasswordBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setupViewByMode();

        binding.btnCancel.setOnClickListener(v -> dismiss());
        binding.btnConfirm.setOnClickListener(v -> handleConfirm());
    }

    private void setupViewByMode() {
        switch (mode) {
            case UNLOCK:
                binding.tvDialogTitle.setText("Mở khóa ghi chú");
                binding.tvDialogMessage.setText("Ghi chú này đã được khóa. Vui lòng nhập mật khẩu để xem nội dung.");
                binding.tilCurrentPassword.setHint("Mật khẩu ghi chú");
                binding.tilNewPassword.setVisibility(View.GONE);
                binding.tilConfirmPassword.setVisibility(View.GONE);
                binding.btnConfirm.setText("Mở khóa");
                break;

            case ENABLE:
                binding.tvDialogTitle.setText("Thiết lập mật khẩu bảo vệ");
                binding.tvDialogMessage.setText("Đặt mật khẩu riêng để bảo vệ nội dung nhạy cảm của ghi chú này.");
                binding.tilCurrentPassword.setHint("Mật khẩu mới");
                binding.tilNewPassword.setVisibility(View.GONE);
                binding.tilConfirmPassword.setVisibility(View.VISIBLE);
                binding.tilConfirmPassword.setHint("Xác nhận mật khẩu");
                binding.btnConfirm.setText("Khóa ghi chú");
                break;

            case CHANGE:
                binding.tvDialogTitle.setText("Đổi mật khẩu ghi chú");
                binding.tvDialogMessage.setText("Nhập mật khẩu hiện tại và mật khẩu mới bạn muốn đổi.");
                binding.tilCurrentPassword.setHint("Mật khẩu hiện tại");
                binding.tilNewPassword.setVisibility(View.VISIBLE);
                binding.tilNewPassword.setHint("Mật khẩu mới");
                binding.tilConfirmPassword.setVisibility(View.VISIBLE);
                binding.tilConfirmPassword.setHint("Xác nhận mật khẩu mới");
                binding.btnConfirm.setText("Cập nhật");
                break;

            case DISABLE:
                binding.tvDialogTitle.setText("Hủy bảo vệ mật khẩu");
                binding.tvDialogMessage.setText("Nhập mật khẩu hiện tại để gỡ bỏ khóa bảo vệ của ghi chú này.");
                binding.tilCurrentPassword.setHint("Mật khẩu hiện tại");
                binding.tilNewPassword.setVisibility(View.GONE);
                binding.tilConfirmPassword.setVisibility(View.GONE);
                binding.btnConfirm.setText("Gỡ bỏ khóa");
                break;
        }
    }

    private void handleConfirm() {
        String currentPass = binding.etCurrentPassword.getText() != null ? binding.etCurrentPassword.getText().toString() : "";
        String newPass = binding.etNewPassword.getText() != null ? binding.etNewPassword.getText().toString() : "";
        String confirmPass = binding.etConfirmPassword.getText() != null ? binding.etConfirmPassword.getText().toString() : "";

        if (mode == Mode.UNLOCK) {
            if (currentPass.isEmpty()) {
                Toast.makeText(getContext(), "Vui lòng nhập mật khẩu", Toast.LENGTH_SHORT).show();
                return;
            }
            listener.onUnlock(currentPass);
            dismiss();
        } else if (mode == Mode.ENABLE) {
            if (currentPass.isEmpty() || confirmPass.isEmpty()) {
                Toast.makeText(getContext(), "Vui lòng nhập đầy đủ thông tin", Toast.LENGTH_SHORT).show();
                return;
            }
            if (!currentPass.equals(confirmPass)) {
                Toast.makeText(getContext(), "Mật khẩu xác nhận không khớp", Toast.LENGTH_SHORT).show();
                return;
            }
            listener.onEnable(currentPass, confirmPass);
            dismiss();
        } else if (mode == Mode.CHANGE) {
            if (currentPass.isEmpty() || newPass.isEmpty() || confirmPass.isEmpty()) {
                Toast.makeText(getContext(), "Vui lòng điền đầy đủ", Toast.LENGTH_SHORT).show();
                return;
            }
            if (!newPass.equals(confirmPass)) {
                Toast.makeText(getContext(), "Mật khẩu mới xác nhận không khớp", Toast.LENGTH_SHORT).show();
                return;
            }
            listener.onChange(currentPass, newPass, confirmPass);
            dismiss();
        } else if (mode == Mode.DISABLE) {
            if (currentPass.isEmpty()) {
                Toast.makeText(getContext(), "Vui lòng nhập mật khẩu hiện tại", Toast.LENGTH_SHORT).show();
                return;
            }
            listener.onDisable(currentPass);
            dismiss();
        }
    }
}
