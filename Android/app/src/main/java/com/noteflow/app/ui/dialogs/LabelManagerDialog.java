package com.noteflow.app.ui.dialogs;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.noteflow.app.data.model.Label;
import com.noteflow.app.databinding.DialogLabelManagerBinding;

public class LabelManagerDialog extends Dialog {

    public interface OnLabelSaveListener {
        void onSave(String name, String color);
        void onDelete(String labelId);
    }

    private final Label existingLabel;
    private final OnLabelSaveListener listener;
    private DialogLabelManagerBinding binding;
    private String selectedColor = "#4F46E5";

    public LabelManagerDialog(@NonNull Context context, Label existingLabel, OnLabelSaveListener listener) {
        super(context);
        this.existingLabel = existingLabel;
        this.listener = listener;
        if (existingLabel != null) {
            this.selectedColor = existingLabel.getColor();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        binding = DialogLabelManagerBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        if (existingLabel != null) {
            binding.tvTitle.setText("Chỉnh sửa nhãn");
            binding.etLabelName.setText(existingLabel.getName());
            binding.btnDeleteLabel.setVisibility(View.VISIBLE);
        } else {
            binding.tvTitle.setText("Thêm nhãn mới");
            binding.btnDeleteLabel.setVisibility(View.GONE);
        }

        setupColorPickers();

        binding.btnCancel.setOnClickListener(v -> dismiss());

        binding.btnDeleteLabel.setOnClickListener(v -> {
            if (existingLabel != null && listener != null) {
                listener.onDelete(existingLabel.getId());
                dismiss();
            }
        });

        binding.btnSave.setOnClickListener(v -> {
            String name = binding.etLabelName.getText() != null ? binding.etLabelName.getText().toString().trim() : "";
            if (name.isEmpty()) {
                Toast.makeText(getContext(), "Vui lòng nhập tên nhãn", Toast.LENGTH_SHORT).show();
                return;
            }
            if (listener != null) {
                listener.onSave(name, selectedColor);
            }
            dismiss();
        });
    }

    private void setupColorPickers() {
        setupSingleColor(binding.color1, "#4F46E5");
        setupSingleColor(binding.color2, "#06B6D4");
        setupSingleColor(binding.color3, "#10B981");
        setupSingleColor(binding.color4, "#F59E0B");
        setupSingleColor(binding.color5, "#EF4444");
        setupSingleColor(binding.color6, "#EC4899");
    }

    private void setupSingleColor(View view, String hexColor) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setShape(GradientDrawable.OVAL);
        drawable.setColor(Color.parseColor(hexColor));
        if (hexColor.equalsIgnoreCase(selectedColor)) {
            drawable.setStroke(6, Color.WHITE);
        }
        view.setBackground(drawable);

        view.setOnClickListener(v -> {
            selectedColor = hexColor;
            setupColorPickers();
        });
    }
}
