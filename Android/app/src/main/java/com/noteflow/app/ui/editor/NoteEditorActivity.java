package com.noteflow.app.ui.editor;

import android.Manifest;
import android.app.DatePickerDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.content.res.ColorStateList;
import android.net.Uri;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.google.android.material.chip.Chip;
import com.noteflow.app.R;
import com.noteflow.app.data.model.Label;
import com.noteflow.app.data.model.Note;
import com.noteflow.app.databinding.ActivityNoteEditorBinding;
import com.noteflow.app.ui.dialogs.AttachLabelsDialog;
import com.noteflow.app.ui.dialogs.NotePasswordDialog;
import com.noteflow.app.ui.dialogs.ShareBottomSheet;
import com.noteflow.app.utils.Constants;
import com.noteflow.app.utils.DateTimeUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;

public class NoteEditorActivity extends AppCompatActivity {

    private ActivityNoteEditorBinding binding;
    private NoteEditorViewModel viewModel;
    private ImageGalleryAdapter imageAdapter;
    private boolean isReadOnly = false;

    // Speech-To-Text
    private SpeechRecognizer speechRecognizer;
    private boolean isRecording = false;

    // Activity Result for Image Picker
    private final ActivityResultLauncher<String> imagePickerLauncher = registerForActivityResult(
            new ActivityResultContracts.GetContent(),
            uri -> {
                if (uri != null) {
                    handleImageSelected(uri);
                }
            }
    );

    // Permission Launcher for Audio
    private final ActivityResultLauncher<String> recordAudioPermissionLauncher = registerForActivityResult(
            new ActivityResultContracts.RequestPermission(),
            isGranted -> {
                if (isGranted) {
                    toggleSpeechRecognition();
                } else {
                    Toast.makeText(this, "Cần cấp quyền Micro để nhập văn bản bằng giọng nói", Toast.LENGTH_SHORT).show();
                }
            }
    );

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityNoteEditorBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModel = new ViewModelProvider(this).get(NoteEditorViewModel.class);

        isReadOnly = getIntent().getBooleanExtra(Constants.EXTRA_IS_READ_ONLY, false);
        Note note = (Note) getIntent().getSerializableExtra("extra_note_data");
        String defaultDate = getIntent().getStringExtra(Constants.EXTRA_NOTE_DATE);

        viewModel.initNote(note, defaultDate);

        setupRecyclerView();
        setupSpeechRecognizer();
        setupObservers();
        setupListeners();

        if (isReadOnly) {
            applyReadOnlyMode();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        viewModel.saveNote(true);
        if (speechRecognizer != null) {
            speechRecognizer.stopListening();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (speechRecognizer != null) {
            speechRecognizer.destroy();
        }
    }

    private void setupRecyclerView() {
        imageAdapter = new ImageGalleryAdapter(imageUrl -> {
            // View image full-screen dialog
            View dialogView = getLayoutInflater().inflate(R.layout.item_image_preview, null);
            new AlertDialog.Builder(this)
                    .setView(dialogView)
                    .setPositiveButton("Đóng", null)
                    .show();
        });
        binding.rvImages.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        binding.rvImages.setAdapter(imageAdapter);
    }

    private void setupSpeechRecognizer() {
        if (SpeechRecognizer.isRecognitionAvailable(this)) {
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
            speechRecognizer.setRecognitionListener(new RecognitionListener() {
                @Override public void onReadyForSpeech(Bundle params) {
                    binding.tvRecordingIndicator.setVisibility(View.VISIBLE);
                }
                @Override public void onBeginningOfSpeech() {}
                @Override public void onRmsChanged(float rmsdB) {}
                @Override public void onBufferReceived(byte[] buffer) {}
                @Override public void onEndOfSpeech() {
                    binding.tvRecordingIndicator.setVisibility(View.GONE);
                    isRecording = false;
                }
                @Override public void onError(int error) {
                    binding.tvRecordingIndicator.setVisibility(View.GONE);
                    isRecording = false;
                }
                @Override public void onResults(Bundle results) {
                    ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                    if (matches != null && !matches.isEmpty()) {
                        String recognizedText = matches.get(0);
                        String currentContent = binding.etNoteContent.getText().toString();
                        binding.etNoteContent.setText(currentContent.isEmpty() ? recognizedText : (currentContent + " " + recognizedText));
                        binding.etNoteContent.setSelection(binding.etNoteContent.getText().length());
                    }
                }
                @Override public void onPartialResults(Bundle partialResults) {}
                @Override public void onEvent(int eventType, Bundle params) {}
            });
        }
    }

    private void setupObservers() {
        viewModel.getCurrentNote().observe(this, note -> {
            if (note != null) {
                if (!binding.etNoteTitle.getText().toString().equals(note.getTitle())) {
                    binding.etNoteTitle.setText(note.getTitle());
                }
                if (!binding.etNoteContent.getText().toString().equals(note.getContent())) {
                    binding.etNoteContent.setText(note.getContent());
                }

                binding.btnPin.setColorFilter(note.isPinned()
                        ? ContextCompat.getColor(this, R.color.pin_color)
                        : ContextCompat.getColor(this, R.color.text_secondary_light));

                binding.btnLock.setColorFilter(note.isPasswordProtected()
                        ? ContextCompat.getColor(this, R.color.warning)
                        : ContextCompat.getColor(this, R.color.text_secondary_light));

                binding.tvEditorDate.setText("Ngày ghi chú: " + DateTimeUtils.formatDisplayDate(note.getNoteDate()));

                // Image list
                if (note.getImages() != null && !note.getImages().isEmpty()) {
                    binding.rvImages.setVisibility(View.VISIBLE);
                    imageAdapter.setImages(note.getImages());
                } else {
                    binding.rvImages.setVisibility(View.GONE);
                }

                // Render Labels Chips
                renderLabels(note.getLabels());
            }
        });

        viewModel.getSaveStatus().observe(this, status -> {
            binding.tvSaveStatus.setText(status);
        });

        viewModel.getMessage().observe(this, msg -> {
            if (msg != null && !msg.isEmpty()) {
                Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
            }
        });

        viewModel.getIsDeleted().observe(this, isDeleted -> {
            if (isDeleted) finish();
        });
    }

    private void renderLabels(List<Label> labels) {
        binding.chipGroupEditorLabels.removeAllViews();
        if (labels != null && !labels.isEmpty()) {
            binding.chipGroupEditorLabels.setVisibility(View.VISIBLE);
            for (Label label : labels) {
                Chip chip = new Chip(this);
                chip.setText(label.getName());
                chip.setTextSize(12);
                try {
                    int color = Color.parseColor(label.getColor());
                    chip.setChipBackgroundColor(ColorStateList.valueOf(Color.argb(35, Color.red(color), Color.green(color), Color.blue(color))));
                    chip.setTextColor(color);
                } catch (Exception e) {
                    chip.setChipBackgroundColor(ColorStateList.valueOf(Color.parseColor("#EEF2FF")));
                    chip.setTextColor(Color.parseColor("#4F46E5"));
                }
                binding.chipGroupEditorLabels.addView(chip);
            }
        } else {
            binding.chipGroupEditorLabels.setVisibility(View.GONE);
        }
    }

    private void setupListeners() {
        binding.editorToolbar.setNavigationOnClickListener(v -> finish());

        // TextWatcher for Auto-save
        TextWatcher autoSaveWatcher = new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (!isReadOnly) {
                    viewModel.onTextChanged(
                            binding.etNoteTitle.getText().toString(),
                            binding.etNoteContent.getText().toString()
                    );
                }
            }
            @Override public void afterTextChanged(Editable s) {}
        };

        binding.etNoteTitle.addTextChangedListener(autoSaveWatcher);
        binding.etNoteContent.addTextChangedListener(autoSaveWatcher);

        binding.btnPin.setOnClickListener(v -> viewModel.togglePin());

        binding.btnLock.setOnClickListener(v -> handleLockClick());

        binding.btnShare.setOnClickListener(v -> {
            Note note = viewModel.getCurrentNote().getValue();
            if (note != null && note.getId() != null) {
                new ShareBottomSheet(note.getId()).show(getSupportFragmentManager(), "ShareBottomSheet");
            } else {
                Toast.makeText(this, "Hãy nhập nội dung để lưu ghi chú trước khi chia sẻ", Toast.LENGTH_SHORT).show();
            }
        });

        binding.btnAttachLabel.setOnClickListener(v -> {
            List<Label> allLabels = viewModel.getAllLabels().getValue();
            Note note = viewModel.getCurrentNote().getValue();
            List<Label> currentLabels = note != null ? note.getLabels() : new ArrayList<>();

            new AttachLabelsDialog(this, allLabels, currentLabels, (selectedLabels, selectedLabelIds) -> {
                viewModel.updateLabels(selectedLabels, selectedLabelIds);
            }).show();
        });

        binding.btnDelete.setOnClickListener(v -> {
            Note note = viewModel.getCurrentNote().getValue();
            if (note != null && note.isPasswordProtected()) {
                new NotePasswordDialog(this, NotePasswordDialog.Mode.UNLOCK, new NotePasswordDialog.OnPasswordActionListener() {
                    @Override
                    public void onUnlock(String password) {
                        viewModel.deleteNote(password);
                    }
                    @Override public void onEnable(String p, String c) {}
                    @Override public void onChange(String cur, String n, String conf) {}
                    @Override public void onDisable(String cur) {}
                }).show();
            } else {
                viewModel.deleteNote(null);
            }
        });

        // Bottom Actions: Checklist Shortcut
        binding.btnChecklist.setOnClickListener(v -> {
            String current = binding.etNoteContent.getText().toString();
            int cursor = binding.etNoteContent.getSelectionStart();
            String checklistPrefix = "\n[ ] ";
            if (current.isEmpty()) checklistPrefix = "[ ] ";

            binding.etNoteContent.getText().insert(cursor, checklistPrefix);
        });

        // Bottom Actions: Voice Dictation
        binding.btnVoice.setOnClickListener(v -> {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                toggleSpeechRecognition();
            } else {
                recordAudioPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO);
            }
        });

        // Bottom Actions: Attach Image
        binding.btnAttachImage.setOnClickListener(v -> imagePickerLauncher.launch("image/*"));

        // Bottom Actions: Change Date
        binding.btnChangeDate.setOnClickListener(v -> {
            Calendar cal = Calendar.getInstance();
            DatePickerDialog dialog = new DatePickerDialog(this, (view, year, month, dayOfMonth) -> {
                String formatted = String.format(Locale.US, "%04d-%02d-%02d", year, month + 1, dayOfMonth);
                viewModel.updateDate(formatted);
            }, cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH));
            dialog.show();
        });
    }

    private void toggleSpeechRecognition() {
        if (speechRecognizer == null) {
            Toast.makeText(this, "Nhận dạng giọng nói không khả dụng", Toast.LENGTH_SHORT).show();
            return;
        }

        if (isRecording) {
            speechRecognizer.stopListening();
            isRecording = false;
            binding.tvRecordingIndicator.setVisibility(View.GONE);
        } else {
            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "vi-VN");
            intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Nói để ghi chú...");
            speechRecognizer.startListening(intent);
            isRecording = true;
        }
    }

    private void handleLockClick() {
        Note note = viewModel.getCurrentNote().getValue();
        if (note == null || note.getId() == null) {
            Toast.makeText(this, "Vui lòng nhập nội dung để lưu ghi chú trước", Toast.LENGTH_SHORT).show();
            return;
        }

        if (note.isPasswordProtected()) {
            String[] options = {"Đổi mật khẩu bảo vệ", "Gỡ bỏ mật khẩu bảo vệ"};
            new AlertDialog.Builder(this)
                    .setTitle("Bảo vệ mật khẩu")
                    .setItems(options, (dialog, which) -> {
                        if (which == 0) {
                            new NotePasswordDialog(this, NotePasswordDialog.Mode.CHANGE, new NotePasswordDialog.OnPasswordActionListener() {
                                @Override public void onUnlock(String p) {}
                                @Override public void onEnable(String p, String c) {}
                                @Override
                                public void onChange(String cur, String n, String conf) {
                                    viewModel.changePassword(cur, n, conf);
                                }
                                @Override public void onDisable(String cur) {}
                            }).show();
                        } else if (which == 1) {
                            new NotePasswordDialog(this, NotePasswordDialog.Mode.DISABLE, new NotePasswordDialog.OnPasswordActionListener() {
                                @Override public void onUnlock(String p) {}
                                @Override public void onEnable(String p, String c) {}
                                @Override public void onChange(String cur, String n, String conf) {}
                                @Override
                                public void onDisable(String cur) {
                                    viewModel.disablePassword(cur);
                                }
                            }).show();
                        }
                    })
                    .show();
        } else {
            new NotePasswordDialog(this, NotePasswordDialog.Mode.ENABLE, new NotePasswordDialog.OnPasswordActionListener() {
                @Override public void onUnlock(String p) {}
                @Override
                public void onEnable(String password, String confirmPassword) {
                    viewModel.enablePassword(password, confirmPassword);
                }
                @Override public void onChange(String cur, String n, String conf) {}
                @Override public void onDisable(String cur) {}
            }).show();
        }
    }

    private void handleImageSelected(Uri uri) {
        try {
            InputStream is = getContentResolver().openInputStream(uri);
            File tempFile = new File(getCacheDir(), "upload_" + System.currentTimeMillis() + ".jpg");
            FileOutputStream fos = new FileOutputStream(tempFile);
            byte[] buffer = new byte[4096];
            int read;
            while ((read = is.read(buffer)) != -1) {
                fos.write(buffer, 0, read);
            }
            fos.close();
            is.close();

            viewModel.uploadImage(tempFile);
        } catch (Exception e) {
            Toast.makeText(this, "Không thể đọc tệp ảnh đã chọn", Toast.LENGTH_SHORT).show();
        }
    }

    private void applyReadOnlyMode() {
        binding.etNoteTitle.setEnabled(false);
        binding.etNoteContent.setEnabled(false);
        binding.btnLock.setVisibility(View.GONE);
        binding.btnDelete.setVisibility(View.GONE);
        binding.btnAttachLabel.setVisibility(View.GONE);
        binding.btnVoice.setVisibility(View.GONE);
        binding.btnAttachImage.setVisibility(View.GONE);
        binding.btnChecklist.setVisibility(View.GONE);
        binding.btnChangeDate.setVisibility(View.GONE);
        binding.tvSaveStatus.setText("Chế độ chỉ xem");
    }
}
