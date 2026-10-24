package com.noteflow.app.ui.dialogs;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.os.Bundle;
import android.view.Window;
import android.widget.CheckBox;

import androidx.annotation.NonNull;

import com.noteflow.app.data.model.Label;
import com.noteflow.app.databinding.DialogAttachLabelsBinding;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class AttachLabelsDialog extends Dialog {

    public interface OnLabelsAttachedListener {
        void onLabelsSelected(List<Label> selectedLabels, List<String> selectedLabelIds);
    }

    private final List<Label> allLabels;
    private final List<Label> currentNoteLabels;
    private final OnLabelsAttachedListener listener;
    private DialogAttachLabelsBinding binding;
    private final Set<String> selectedIds = new HashSet<>();

    public AttachLabelsDialog(@NonNull Context context, List<Label> allLabels, List<Label> currentNoteLabels, OnLabelsAttachedListener listener) {
        super(context);
        this.allLabels = allLabels != null ? allLabels : new ArrayList<>();
        this.currentNoteLabels = currentNoteLabels != null ? currentNoteLabels : new ArrayList<>();
        this.listener = listener;

        for (Label l : this.currentNoteLabels) {
            selectedIds.add(l.getId());
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        binding = DialogAttachLabelsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        populateCheckboxes();

        binding.btnCancel.setOnClickListener(v -> dismiss());

        binding.btnDone.setOnClickListener(v -> {
            List<Label> selected = new ArrayList<>();
            List<String> ids = new ArrayList<>(selectedIds);
            for (Label l : allLabels) {
                if (selectedIds.contains(l.getId())) {
                    selected.add(l);
                }
            }
            if (listener != null) {
                listener.onLabelsSelected(selected, ids);
            }
            dismiss();
        });
    }

    private void populateCheckboxes() {
        binding.layoutCheckboxes.removeAllViews();
        for (Label label : allLabels) {
            CheckBox cb = new CheckBox(getContext());
            cb.setText(label.getName());
            cb.setTextSize(15);
            try {
                cb.setTextColor(Color.parseColor(label.getColor()));
            } catch (Exception e) {
                cb.setTextColor(Color.BLACK);
            }
            cb.setChecked(selectedIds.contains(label.getId()));
            cb.setOnCheckedChangeListener((buttonView, isChecked) -> {
                if (isChecked) {
                    selectedIds.add(label.getId());
                } else {
                    selectedIds.remove(label.getId());
                }
            });
            binding.layoutCheckboxes.addView(cb);
        }
    }
}
