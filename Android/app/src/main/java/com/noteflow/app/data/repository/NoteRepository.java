package com.noteflow.app.data.repository;

import android.content.Context;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.Transformations;

import com.noteflow.app.data.api.ApiService;
import com.noteflow.app.data.api.RetrofitClient;
import com.noteflow.app.data.local.AppDatabase;
import com.noteflow.app.data.local.dao.NoteDao;
import com.noteflow.app.data.local.entity.NoteEntity;
import com.noteflow.app.data.model.Note;
import com.noteflow.app.data.model.request.NoteRequest;
import com.noteflow.app.data.model.response.ApiResponse;
import com.noteflow.app.data.model.response.ImageUploadResponse;
import com.noteflow.app.data.model.response.NoteDetailResponse;
import com.noteflow.app.data.model.response.NoteListResponse;
import com.noteflow.app.data.model.response.ShareLinkResponse;
import com.noteflow.app.data.model.response.SharesResponse;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class NoteRepository {

    private final ApiService apiService;
    private final NoteDao noteDao;
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    public NoteRepository(Context context) {
        this.apiService = RetrofitClient.getInstance();
        this.noteDao = AppDatabase.getInstance(context).noteDao();
    }

    public LiveData<List<Note>> getLocalActiveNotes() {
        return Transformations.map(noteDao.getAllActiveNotes(), entities -> {
            List<Note> notes = new ArrayList<>();
            if (entities != null) {
                for (NoteEntity entity : entities) {
                    notes.add(entity.toNote());
                }
            }
            return notes;
        });
    }

    public LiveData<List<Note>> getLocalTrashNotes() {
        return Transformations.map(noteDao.getTrashNotes(), entities -> {
            List<Note> notes = new ArrayList<>();
            if (entities != null) {
                for (NoteEntity entity : entities) {
                    notes.add(entity.toNote());
                }
            }
            return notes;
        });
    }

    public void fetchNotes(String date, String search, String labelId, Object includeDeleted, Integer sharedWithMe, Integer includeShared, Callback<NoteListResponse> callback) {
        apiService.getNotes(date, search, labelId, includeDeleted, sharedWithMe, includeShared).enqueue(new Callback<NoteListResponse>() {
            @Override
            public void onResponse(Call<NoteListResponse> call, Response<NoteListResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    executorService.execute(() -> {
                        List<NoteEntity> entities = new ArrayList<>();
                        for (Note n : response.body().getNotes()) {
                            entities.add(NoteEntity.fromNote(n));
                        }
                        if (search == null && labelId == null && (includeDeleted == null || includeDeleted.equals(0))) {
                            // Caching list active notes
                            noteDao.insertOrUpdateAll(entities);
                        }
                    });
                }
                if (callback != null) callback.onResponse(call, response);
            }

            @Override
            public void onFailure(Call<NoteListResponse> call, Throwable t) {
                if (callback != null) callback.onFailure(call, t);
            }
        });
    }

    public void createNote(NoteRequest request, Callback<NoteDetailResponse> callback) {
        apiService.createNote(request).enqueue(new Callback<NoteDetailResponse>() {
            @Override
            public void onResponse(Call<NoteDetailResponse> call, Response<NoteDetailResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getNote() != null) {
                    executorService.execute(() -> noteDao.insertOrUpdate(NoteEntity.fromNote(response.body().getNote())));
                }
                if (callback != null) callback.onResponse(call, response);
            }

            @Override
            public void onFailure(Call<NoteDetailResponse> call, Throwable t) {
                if (callback != null) callback.onFailure(call, t);
            }
        });
    }

    public void updateNote(String id, NoteRequest request, Callback<NoteDetailResponse> callback) {
        apiService.updateNote(id, request).enqueue(new Callback<NoteDetailResponse>() {
            @Override
            public void onResponse(Call<NoteDetailResponse> call, Response<NoteDetailResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getNote() != null) {
                    executorService.execute(() -> noteDao.insertOrUpdate(NoteEntity.fromNote(response.body().getNote())));
                }
                if (callback != null) callback.onResponse(call, response);
            }

            @Override
            public void onFailure(Call<NoteDetailResponse> call, Throwable t) {
                if (callback != null) callback.onFailure(call, t);
            }
        });
    }

    public void deleteNote(String id, String password, Callback<ApiResponse> callback) {
        Map<String, String> body = new HashMap<>();
        if (password != null) body.put("noteAccessPassword", password);
        apiService.deleteNote(id, body).enqueue(new Callback<ApiResponse>() {
            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                if (response.isSuccessful()) {
                    executorService.execute(() -> {
                        NoteEntity entity = noteDao.getNoteById(id);
                        if (entity != null) {
                            entity.setDeleted(true);
                            noteDao.insertOrUpdate(entity);
                        }
                    });
                }
                if (callback != null) callback.onResponse(call, response);
            }

            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                if (callback != null) callback.onFailure(call, t);
            }
        });
    }

    public void deleteNotePermanently(String id, String password, Callback<ApiResponse> callback) {
        Map<String, String> body = new HashMap<>();
        if (password != null) body.put("noteAccessPassword", password);
        apiService.deleteNotePermanently(id, body).enqueue(new Callback<ApiResponse>() {
            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                if (response.isSuccessful()) {
                    executorService.execute(() -> noteDao.deleteById(id));
                }
                if (callback != null) callback.onResponse(call, response);
            }

            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                if (callback != null) callback.onFailure(call, t);
            }
        });
    }

    // Password Lock API
    public void verifyNotePassword(String id, String password, Callback<NoteDetailResponse> callback) {
        Map<String, String> body = new HashMap<>();
        body.put("password", password);
        apiService.verifyNotePassword(id, body).enqueue(callback);
    }

    public void enableNotePassword(String id, String password, String confirmPassword, Callback<NoteDetailResponse> callback) {
        Map<String, String> body = new HashMap<>();
        body.put("password", password);
        body.put("confirmPassword", confirmPassword);
        apiService.enableNotePassword(id, body).enqueue(callback);
    }

    public void changeNotePassword(String id, String currentPassword, String newPassword, String confirmNewPassword, Callback<NoteDetailResponse> callback) {
        Map<String, String> body = new HashMap<>();
        body.put("currentPassword", currentPassword);
        body.put("newPassword", newPassword);
        body.put("confirmNewPassword", confirmNewPassword);
        apiService.changeNotePassword(id, body).enqueue(callback);
    }

    public void disableNotePassword(String id, String currentPassword, Callback<NoteDetailResponse> callback) {
        Map<String, String> body = new HashMap<>();
        body.put("currentPassword", currentPassword);
        apiService.disableNotePassword(id, body).enqueue(callback);
    }

    // Image Upload
    public void uploadImage(String noteId, File imageFile, Callback<ImageUploadResponse> callback) {
        RequestBody reqFile = RequestBody.create(MediaType.parse("image/*"), imageFile);
        MultipartBody.Part body = MultipartBody.Part.createFormData("image", imageFile.getName(), reqFile);
        apiService.uploadNoteImage(noteId, body).enqueue(callback);
    }

    // Shares
    public void generateShareLink(String noteId, Callback<ShareLinkResponse> callback) {
        apiService.generateShareLink(noteId).enqueue(callback);
    }

    public void getNoteShares(String noteId, Callback<SharesResponse> callback) {
        apiService.getNoteShares(noteId).enqueue(callback);
    }

    public void updatePublicPermission(String noteId, String permission, Callback<ApiResponse> callback) {
        Map<String, String> body = new HashMap<>();
        body.put("permission", permission);
        apiService.updatePublicPermission(noteId, body).enqueue(callback);
    }

    public void addShareUser(String noteId, String email, String permission, Callback<ApiResponse> callback) {
        Map<String, String> body = new HashMap<>();
        body.put("email", email);
        body.put("permission", permission);
        apiService.addShareUser(noteId, body).enqueue(callback);
    }

    public void removeShareUser(String noteId, String email, Callback<ApiResponse> callback) {
        apiService.removeShareUser(noteId, email).enqueue(callback);
    }

    public void saveNoteLocally(Note note) {
        executorService.execute(() -> noteDao.insertOrUpdate(NoteEntity.fromNote(note)));
    }
}
