package com.noteflow.app.ui.profile;

import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.lifecycle.ViewModelProvider;

import com.noteflow.app.data.session.SessionManager;
import com.noteflow.app.databinding.ActivityProfileBinding;

public class ProfileActivity extends AppCompatActivity {

    private ActivityProfileBinding binding;
    private ProfileViewModel viewModel;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityProfileBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);
        viewModel = new ViewModelProvider(this).get(ProfileViewModel.class);

        setupInitialData();
        setupObservers();
        setupListeners();

        viewModel.loadProfile();
    }

    private void setupInitialData() {
        binding.etFullName.setText(sessionManager.getUserName());
        binding.etEmail.setText(sessionManager.getUserEmail());

        boolean isDark = "dark".equalsIgnoreCase(sessionManager.getTheme());
        binding.switchDarkMode.setChecked(isDark);
    }

    private void setupObservers() {
        viewModel.getUserProfile().observe(this, user -> {
            if (user != null) {
                binding.etFullName.setText(user.getFullName());
                binding.etEmail.setText(user.getEmail());
                sessionManager.setUserName(user.getFullName());
            }
        });

        viewModel.getMessage().observe(this, msg -> {
            if (msg != null && !msg.isEmpty()) {
                Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setupListeners() {
        binding.btnBack.setOnClickListener(v -> finish());

        binding.btnSaveProfile.setOnClickListener(v -> {
            String name = binding.etFullName.getText() != null ? binding.etFullName.getText().toString() : "";
            viewModel.updateFullName(name);
        });

        binding.btnChangePassword.setOnClickListener(v -> {
            String currentPass = binding.etCurrentPassword.getText() != null ? binding.etCurrentPassword.getText().toString() : "";
            String newPass = binding.etNewPassword.getText() != null ? binding.etNewPassword.getText().toString() : "";
            viewModel.changePassword(currentPass, newPass);
            binding.etCurrentPassword.setText("");
            binding.etNewPassword.setText("");
        });

        binding.switchDarkMode.setOnCheckedChangeListener((buttonView, isChecked) -> {
            String newTheme = isChecked ? "dark" : "light";
            sessionManager.setTheme(newTheme);
            AppCompatDelegate.setDefaultNightMode(
                    isChecked ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_NO
            );
        });
    }
}
