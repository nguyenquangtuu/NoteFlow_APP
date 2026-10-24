package com.noteflow.app.ui.editor;

import android.app.Application;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.noteflow.app.data.model.Label;
import com.noteflow.app.data.model.Note;
import com.noteflow.app.data.model.request.NoteRequest;
import com.noteflow.app.data.model.response.ApiResponse;
import com.noteflow.app.data.model.response.ImageUploadResponse;
import com.noteflow.app.data.model.response.NoteDetailResponse;
import com.noteflow.app.data.repository.LabelRepository;
import com.noteflow.app.data.repository.NoteRepository;
import com.noteflow.app.utils.DateTimeUtils;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class NoteEditorViewModel extends AndroidViewModel {

    private final NoteRepository noteRepository;
    private final LabelRepository labelRepository;

    private final MutableLiveData<Note> currentNote = new MutableLiveData<>();
    private final MutableLiveData<String> saveStatus = new MutableLiveData<>("Đã lưu");
    private final MutableLiveData<String> message = new MutableLiveData<>();
    private final MutableLiveData<Boolean> isSaving = new MutableLiveData<>(false);
    private final MutableLiveData<Boolean> isDeleted = new MutableLiveData<>(false);

    private final Handler autoSaveHandler = new Handler(Looper.getMainLooper());
    private Runnable autoSaveRunnable;

    public NoteEditorViewModel(@NonNull Application application) {
        super(application);
        this.noteRepository = new NoteRepository(application);
        this.labelRepository = new LabelRepository(application);
    }

    public LiveData<Note> getCurrentNote() { return currentNote; }
    public LiveData<String> getSaveStatus() { return saveStatus; }
    public LiveData<String> getMessage() { return message; }
    public LiveData<Boolean> getIsDeleted() { return isDeleted; }
    public LiveData<List<Label>> getAllLabels() { return labelRepository.getLocalLabels(); }

    public void initNote(Note note, String defaultDate) {
        if (note != null) {
            currentNote.setValue(note);
        } else {
            Note newNote = new Note();
            newNote.setTitle("");
            newNote.setContent("");
            newNote.setNoteDate(defaultDate != null ? defaultDate : DateTimeUtils.getTodayApiDate());
            currentNote.setValue(newNote);
        }
    }

    public void onTextChanged(String title, String content) {
        Note note = currentNote.getValue();
        if (note == null) return;

        if (note.getTitle().equals(title) && note.getContent().equals(content)) {
            return;
        }

        note.setTitle(title);
        note.setContent(content);
        currentNote.setValue(note);

        saveStatus.setValue("Đang lưu...");

        if (autoSaveRunnable != null) {
            autoSaveHandler.removeCallbacks(autoSaveRunnable);
        }

        autoSaveRunnable = () -> saveNote(false);
        autoSaveHandler.postDelayed(autoSaveRunnable, 800);
    }

    public void saveNote(boolean isSyncNow) {
        Note note = currentNote.getValue();
        if (note == null) return;

        // Don't create empty note on server
        if (note.getId() == null && note.getTitle().trim().isEmpty() && note.getContent().trim().isEmpty()) {
            saveStatus.setValue("Đã lưu");
            return;
        }

        isSaving.setValue(true);
        NoteRequest req = new NoteRequest();
        req.setTitle(note.getTitle());
        req.setContent(note.getContent());
        req.setNoteDate(note.getNoteDate());
        req.setPinned(note.isPinned());
        req.setDeleted(note.isDeleted());

        List<String> labelIds = new ArrayList<>();
        if (note.getLabels() != null) {
            for (Label l : note.getLabels()) labelIds.add(l.getId());
        }
        req.setLabelIds(labelIds);

        if (note.getId() == null) {
            // Create Note
            noteRepository.createNote(req, new Callback<NoteDetailResponse>() {
                @Override
                public void onResponse(Call<NoteDetailResponse> call, Response<NoteDetailResponse> response) {
                    isSaving.setValue(false);
                    if (response.isSuccessful() && response.body() != null && response.body().getNote() != null) {
                        currentNote.setValue(response.body().getNote());
                        saveStatus.setValue("Đã lưu");
                    } else {
                        saveStatus.setValue("Lỗi lưu");
                    }
                }

                @Override
                public void onFailure(Call<NoteDetailResponse> call, Throwable t) {
                    isSaving.setValue(false);
                    saveStatus.setValue("Ngoại tuyến (đã lưu local)");
                    noteRepository.saveNoteLocally(note);
                }
            });
        } else {
            // Update Note
            noteRepository.updateNote(note.getId(), req, new Callback<NoteDetailResponse>() {
                @Override
                public void onResponse(Call<NoteDetailResponse> call, Response<NoteDetailResponse> response) {
                    isSaving.setValue(false);
                    if (response.isSuccessful() && response.body() != null && response.body().getNote() != null) {
                        saveStatus.setValue("Đã lưu");
                    } else {
                        saveStatus.setValue("Lỗi lưu");
                    }
                }

                @Override
                public void onFailure(Call<NoteDetailResponse> call, Throwable t) {
                    isSaving.setValue(false);
                    saveStatus.setValue("Ngoại tuyến (đã lưu local)");
                    noteRepository.saveNoteLocally(note);
                }
            });
        }
    }

    public void togglePin() {
        Note note = currentNote.getValue();
        if (note == null) return;
        note.setPinned(!note.isPinned());
        currentNote.setValue(note);
        saveNote(true);
    }

    public void updateLabels(List<Label> labels, List<String> labelIds) {
        Note note = currentNote.getValue();
        if (note == null) return;
        note.setLabels(labels);
        currentNote.setValue(note);
        saveNote(true);
    }

    public void updateDate(String date) {
        Note note = currentNote.getValue();
        if (note == null) return;
        note.setNoteDate(date);
        currentNote.setValue(note);
        saveNote(true);
    }

    public void uploadImage(File imageFile) {
        Note note = currentNote.getValue();
        if (note == null || note.getId() == null) {
            message.setValue("Vui lòng đợi ghi chú được lưu trước khi tải ảnh.");
            return;
        }

        saveStatus.setValue("Đang tải ảnh lên...");
        noteRepository.uploadImage(note.getId(), imageFile, new Callback<ImageUploadResponse>() {
            @Override
            public void onResponse(Call<ImageUploadResponse> call, Response<ImageUploadResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    note.setImages(response.body().getImages());
                    currentNote.setValue(note);
                    saveStatus.setValue("Đã tải ảnh xong");
                } else {
                    saveStatus.setValue("Lỗi tải ảnh");
                }
            }

            @Override
            public void onFailure(Call<ImageUploadResponse> call, Throwable t) {
                saveStatus.setValue("Lỗi kết nối tải ảnh");
            }
        });
    }

    public void enablePassword(String password, String confirmPassword) {
        Note note = currentNote.getValue();
        if (note == null || note.getId() == null) return;

        noteRepository.enableNotePassword(note.getId(), password, confirmPassword, new Callback<NoteDetailResponse>() {
            @Override
            public void onResponse(Call<NoteDetailResponse> call, Response<NoteDetailResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getNote() != null) {
                    currentNote.setValue(response.body().getNote());
                    message.setValue("Đã thiết lập mật khẩu bảo vệ!");
                }
            }
            @Override public void onFailure(Call<NoteDetailResponse> call, Throwable t) {}
        });
    }

    public void changePassword(String currentPass, String newPass, String confirmPass) {
        Note note = currentNote.getValue();
        if (note == null || note.getId() == null) return;

        noteRepository.changeNotePassword(note.getId(), currentPass, newPass, confirmPass, new Callback<NoteDetailResponse>() {
            @Override
            public void onResponse(Call<NoteDetailResponse> call, Response<NoteDetailResponse> response) {
                if (response.isSuccessful()) {
                    message.setValue("Đã đổi mật khẩu ghi chú thành công!");
                } else {
                    message.setValue("Mật khẩu hiện tại không đúng.");
                }
            }
            @Override public void onFailure(Call<NoteDetailResponse> call, Throwable t) {}
        });
    }

    public void disablePassword(String currentPass) {
        Note note = currentNote.getValue();
        if (note == null || note.getId() == null) return;

        noteRepository.disableNotePassword(note.getId(), currentPass, new Callback<NoteDetailResponse>() {
            @Override
            public void onResponse(Call<NoteDetailResponse> call, Response<NoteDetailResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getNote() != null) {
                    currentNote.setValue(response.body().getNote());
                    message.setValue("Đã gỡ bỏ mật khẩu bảo vệ!");
                } else {
                    message.setValue("Mật khẩu không đúng.");
                }
            }
            @Override public void onFailure(Call<NoteDetailResponse> call, Throwable t) {}
        });
    }

    public void deleteNote(String password) {
        Note note = currentNote.getValue();
        if (note == null || note.getId() == null) {
            isDeleted.setValue(true);
            return;
        }

        noteRepository.deleteNote(note.getId(), password, new Callback<ApiResponse>() {
            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                if (response.isSuccessful()) {
                    isDeleted.setValue(true);
                } else {
                    message.setValue("Không thể xóa ghi chú.");
                }
            }
            @Override public void onFailure(Call<ApiResponse> call, Throwable t) {}
        });
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        if (autoSaveRunnable != null) {
            autoSaveHandler.removeCallbacks(autoSaveRunnable);
        }
    }
}
