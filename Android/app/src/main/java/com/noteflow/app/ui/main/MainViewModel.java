package com.noteflow.app.ui.main;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.MutableLiveData;

import com.noteflow.app.data.model.Label;
import com.noteflow.app.data.model.Note;
import com.noteflow.app.data.model.request.NoteRequest;
import com.noteflow.app.data.model.response.ApiResponse;
import com.noteflow.app.data.model.response.LabelDetailResponse;
import com.noteflow.app.data.model.response.LabelListResponse;
import com.noteflow.app.data.model.response.NoteDetailResponse;
import com.noteflow.app.data.model.response.NoteListResponse;
import com.noteflow.app.data.repository.LabelRepository;
import com.noteflow.app.data.repository.NoteRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainViewModel extends AndroidViewModel {

    public enum FilterType {
        ALL, PINNED, SHARED, TRASH
    }

    private final NoteRepository noteRepository;
    private final LabelRepository labelRepository;

    private final MutableLiveData<FilterType> currentFilter = new MutableLiveData<>(FilterType.ALL);
    private final MutableLiveData<String> selectedLabelId = new MutableLiveData<>(null);
    private final MutableLiveData<String> selectedDate = new MutableLiveData<>(null); // null = All dates
    private final MutableLiveData<String> searchQuery = new MutableLiveData<>("");
    private final MutableLiveData<String> sortOrder = new MutableLiveData<>("newest"); // "newest" | "oldest"
    private final MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);
    private final MutableLiveData<String> message = new MutableLiveData<>();

    private final MutableLiveData<List<Note>> remoteNotes = new MutableLiveData<>(new ArrayList<>());
    private final MediatorLiveData<List<Note>> visibleNotes = new MediatorLiveData<>();

    public MainViewModel(@NonNull Application application) {
        super(application);
        this.noteRepository = new NoteRepository(application);
        this.labelRepository = new LabelRepository(application);

        // Recompute visible notes whenever any filter criteria or note data updates
        visibleNotes.addSource(remoteNotes, notes -> applyFiltersAndSort());
        visibleNotes.addSource(currentFilter, filter -> applyFiltersAndSort());
        visibleNotes.addSource(selectedLabelId, label -> applyFiltersAndSort());
        visibleNotes.addSource(selectedDate, date -> applyFiltersAndSort());
        visibleNotes.addSource(searchQuery, query -> applyFiltersAndSort());
        visibleNotes.addSource(sortOrder, sort -> applyFiltersAndSort());
    }

    public LiveData<List<Note>> getVisibleNotes() { return visibleNotes; }
    public LiveData<List<Label>> getLabels() { return labelRepository.getLocalLabels(); }
    public LiveData<FilterType> getCurrentFilter() { return currentFilter; }
    public LiveData<String> getSelectedLabelId() { return selectedLabelId; }
    public LiveData<String> getSelectedDate() { return selectedDate; }
    public LiveData<String> getSortOrder() { return sortOrder; }
    public LiveData<Boolean> getIsLoading() { return isLoading; }
    public LiveData<String> getMessage() { return message; }

    public void setFilter(FilterType filter) {
        selectedLabelId.setValue(null);
        currentFilter.setValue(filter);
        refreshData();
    }

    public void selectLabel(String labelId) {
        currentFilter.setValue(FilterType.ALL);
        selectedLabelId.setValue(labelId);
        refreshData();
    }

    public void setDateFilter(String date) {
        selectedDate.setValue(date);
        applyFiltersAndSort();
    }

    public void setSearchQuery(String query) {
        searchQuery.setValue(query);
    }

    public void toggleSortOrder() {
        if ("newest".equals(sortOrder.getValue())) {
            sortOrder.setValue("oldest");
        } else {
            sortOrder.setValue("newest");
        }
    }

    public void refreshData() {
        isLoading.setValue(true);
        FilterType filter = currentFilter.getValue() != null ? currentFilter.getValue() : FilterType.ALL;

        Object includeDeleted = (filter == FilterType.TRASH) ? 1 : 0;
        Integer sharedWithMe = (filter == FilterType.SHARED) ? 1 : null;
        Integer includeShared = (filter == FilterType.ALL) ? 1 : null;
        String labelId = selectedLabelId.getValue();

        noteRepository.fetchNotes(null, null, labelId, includeDeleted, sharedWithMe, includeShared, new Callback<NoteListResponse>() {
            @Override
            public void onResponse(Call<NoteListResponse> call, Response<NoteListResponse> response) {
                isLoading.setValue(false);
                if (response.isSuccessful() && response.body() != null) {
                    remoteNotes.setValue(response.body().getNotes());
                }
            }

            @Override
            public void onFailure(Call<NoteListResponse> call, Throwable t) {
                isLoading.setValue(false);
                message.setValue("Không thể tải danh sách ghi chú từ server.");
            }
        });

        labelRepository.fetchLabels(null);
    }

    private void applyFiltersAndSort() {
        List<Note> source = remoteNotes.getValue();
        if (source == null) {
            visibleNotes.setValue(new ArrayList<>());
            return;
        }

        FilterType filter = currentFilter.getValue() != null ? currentFilter.getValue() : FilterType.ALL;
        String labelId = selectedLabelId.getValue();
        String date = selectedDate.getValue();
        String query = searchQuery.getValue() != null ? searchQuery.getValue().toLowerCase().trim() : "";
        String sort = sortOrder.getValue() != null ? sortOrder.getValue() : "newest";

        List<Note> result = new ArrayList<>();

        for (Note note : source) {
            // Filter by type
            if (filter == FilterType.PINNED && !note.isPinned()) continue;
            if (filter == FilterType.SHARED && !note.isSharedWithMe()) continue;
            if (filter == FilterType.TRASH && !note.isDeleted()) continue;
            if (filter != FilterType.TRASH && note.isDeleted()) continue;

            // Filter by label
            if (labelId != null && !labelId.isEmpty()) {
                boolean hasLabel = false;
                if (note.getLabels() != null) {
                    for (Label l : note.getLabels()) {
                        if (labelId.equals(l.getId())) {
                            hasLabel = true;
                            break;
                        }
                    }
                }
                if (!hasLabel) continue;
            }

            // Filter by date
            if (date != null && !date.isEmpty() && !date.equals(note.getNoteDate())) {
                continue;
            }

            // Search query filter
            if (!query.isEmpty()) {
                boolean matchTitle = note.getTitle().toLowerCase().contains(query);
                boolean matchContent = note.getContent().toLowerCase().contains(query);
                if (!matchTitle && !matchContent) continue;
            }

            result.add(note);
        }

        // Sorting
        Collections.sort(result, (a, b) -> {
            // Pinned first if not in trash
            if (filter != FilterType.TRASH) {
                if (a.isPinned() != b.isPinned()) {
                    return a.isPinned() ? -1 : 1;
                }
            }
            int dateCompare = (b.getNoteDate() != null ? b.getNoteDate() : "").compareTo(a.getNoteDate() != null ? a.getNoteDate() : "");
            return "newest".equals(sort) ? dateCompare : -dateCompare;
        });

        visibleNotes.setValue(result);
    }

    public void togglePin(Note note) {
        NoteRequest req = new NoteRequest();
        req.setPinned(!note.isPinned());
        noteRepository.updateNote(note.getId(), req, new Callback<NoteDetailResponse>() {
            @Override
            public void onResponse(Call<NoteDetailResponse> call, Response<NoteDetailResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getNote() != null) {
                    updateNoteInList(response.body().getNote());
                }
            }

            @Override
            public void onFailure(Call<NoteDetailResponse> call, Throwable t) {
                message.setValue("Lỗi cập nhật ghim ghi chú.");
            }
        });
    }

    public void deleteNote(Note note, String password) {
        noteRepository.deleteNote(note.getId(), password, new Callback<ApiResponse>() {
            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                if (response.isSuccessful()) {
                    removeNoteFromList(note.getId());
                    message.setValue("Đã chuyển vào thùng rác.");
                } else {
                    message.setValue("Mật khẩu không đúng hoặc không thể xóa.");
                }
            }

            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                message.setValue("Lỗi khi xóa ghi chú.");
            }
        });
    }

    public void restoreNote(Note note) {
        NoteRequest req = new NoteRequest();
        req.setDeleted(false);
        noteRepository.updateNote(note.getId(), req, new Callback<NoteDetailResponse>() {
            @Override
            public void onResponse(Call<NoteDetailResponse> call, Response<NoteDetailResponse> response) {
                if (response.isSuccessful()) {
                    removeNoteFromList(note.getId());
                    message.setValue("Đã khôi phục ghi chú.");
                }
            }

            @Override
            public void onFailure(Call<NoteDetailResponse> call, Throwable t) {
                message.setValue("Lỗi khôi phục ghi chú.");
            }
        });
    }

    public void deletePermanently(Note note, String password) {
        noteRepository.deleteNotePermanently(note.getId(), password, new Callback<ApiResponse>() {
            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                if (response.isSuccessful()) {
                    removeNoteFromList(note.getId());
                    message.setValue("Đã xóa vĩnh viễn.");
                } else {
                    message.setValue("Mật khẩu không đúng.");
                }
            }

            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                message.setValue("Lỗi khi xóa vĩnh viễn.");
            }
        });
    }

    public void createLabel(String name, String color) {
        labelRepository.createLabel(name, color, new Callback<LabelDetailResponse>() {
            @Override
            public void onResponse(Call<LabelDetailResponse> call, Response<LabelDetailResponse> response) {
                if (response.isSuccessful()) {
                    message.setValue("Đã tạo nhãn mới.");
                    labelRepository.fetchLabels(null);
                }
            }

            @Override
            public void onFailure(Call<LabelDetailResponse> call, Throwable t) {
                message.setValue("Lỗi tạo nhãn mới.");
            }
        });
    }

    public void updateLabel(String id, String name, String color) {
        labelRepository.updateLabel(id, name, color, new Callback<ApiResponse>() {
            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                if (response.isSuccessful()) {
                    message.setValue("Đã sửa nhãn.");
                    labelRepository.fetchLabels(null);
                }
            }

            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                message.setValue("Lỗi cập nhật nhãn.");
            }
        });
    }

    public void deleteLabel(String id) {
        labelRepository.deleteLabel(id, new Callback<ApiResponse>() {
            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                if (response.isSuccessful()) {
                    message.setValue("Đã xóa nhãn.");
                    labelRepository.fetchLabels(null);
                }
            }

            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                message.setValue("Lỗi xóa nhãn.");
            }
        });
    }

    public void updateNoteInList(Note updatedNote) {
        List<Note> list = remoteNotes.getValue();
        if (list == null) return;
        List<Note> newList = new ArrayList<>(list);
        boolean found = false;
        for (int i = 0; i < newList.size(); i++) {
            if (newList.get(i).getId().equals(updatedNote.getId())) {
                newList.set(i, updatedNote);
                found = true;
                break;
            }
        }
        if (!found) {
            newList.add(0, updatedNote);
        }
        remoteNotes.setValue(newList);
    }

    public void removeNoteFromList(String noteId) {
        List<Note> list = remoteNotes.getValue();
        if (list == null) return;
        List<Note> newList = new ArrayList<>();
        for (Note n : list) {
            if (!n.getId().equals(noteId)) {
                newList.add(n);
            }
        }
        remoteNotes.setValue(newList);
    }
}
