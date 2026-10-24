package com.noteflow.app.ui.main;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;

import com.google.android.material.chip.Chip;
import com.noteflow.app.R;
import com.noteflow.app.data.model.Label;
import com.noteflow.app.data.model.Note;
import com.noteflow.app.data.model.response.NoteDetailResponse;
import com.noteflow.app.data.repository.NoteRepository;
import com.noteflow.app.data.session.SessionManager;
import com.noteflow.app.databinding.ActivityMainBinding;
import com.noteflow.app.realtime.SocketManager;
import com.noteflow.app.ui.dialogs.LabelManagerDialog;
import com.noteflow.app.ui.dialogs.NotePasswordDialog;
import com.noteflow.app.ui.dialogs.ShareBottomSheet;
import com.noteflow.app.ui.editor.NoteEditorActivity;
import com.noteflow.app.ui.profile.ProfileActivity;
import com.noteflow.app.utils.Constants;
import com.noteflow.app.utils.DateTimeUtils;

import java.util.Calendar;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements SocketManager.SocketEventListener {

    private ActivityMainBinding binding;
    private MainViewModel viewModel;
    private SessionManager sessionManager;
    private NoteAdapter noteAdapter;
    private boolean isGridMode = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);
        viewModel = new ViewModelProvider(this).get(MainViewModel.class);

        isGridMode = "grid".equalsIgnoreCase(sessionManager.getViewMode());

        setupRecyclerView();
        setupToolbarAndSearch();
        setupBottomNavigation();
        setupObservers();
        setupListeners();

        SocketManager.getInstance().addListener(this);
        viewModel.refreshData();
    }

    @Override
    protected void onResume() {
        super.onResume();
        viewModel.refreshData();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SocketManager.getInstance().removeListener(this);
    }

    private void setupRecyclerView() {
        noteAdapter = new NoteAdapter(new NoteAdapter.OnNoteClickListener() {
            @Override
            public void onNoteClick(Note note) {
                handleNoteClick(note);
            }

            @Override
            public void onNoteLongClick(Note note) {
                showNoteQuickActions(note);
            }
        });

        updateLayoutManager();
        binding.rvNotes.setAdapter(noteAdapter);
    }

    private void updateLayoutManager() {
        if (isGridMode) {
            binding.rvNotes.setLayoutManager(new StaggeredGridLayoutManager(2, StaggeredGridLayoutManager.VERTICAL));
            binding.btnToggleView.setImageResource(R.drawable.ic_list);
        } else {
            binding.rvNotes.setLayoutManager(new LinearLayoutManager(this));
            binding.btnToggleView.setImageResource(R.drawable.ic_grid);
        }
    }

    private void setupToolbarAndSearch() {
        View searchPlate = binding.searchView.findViewById(androidx.appcompat.R.id.search_plate);
        if (searchPlate != null) {
            searchPlate.setBackgroundColor(Color.TRANSPARENT);
        }

        binding.searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                viewModel.setSearchQuery(query);
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                viewModel.setSearchQuery(newText);
                return true;
            }
        });
    }

    private void setupBottomNavigation() {
        binding.bottomNavigation.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.nav_home) {
                viewModel.setFilter(MainViewModel.FilterType.ALL);
                binding.tvSectionTitle.setText(R.string.all_notes);
                binding.fabNewNote.show();
                return true;
            } else if (itemId == R.id.nav_pinned) {
                viewModel.setFilter(MainViewModel.FilterType.PINNED);
                binding.tvSectionTitle.setText(R.string.pinned_notes);
                binding.fabNewNote.show();
                return true;
            } else if (itemId == R.id.nav_shared) {
                viewModel.setFilter(MainViewModel.FilterType.SHARED);
                binding.tvSectionTitle.setText(R.string.shared_with_me);
                binding.fabNewNote.show();
                return true;
            } else if (itemId == R.id.nav_trash) {
                viewModel.setFilter(MainViewModel.FilterType.TRASH);
                binding.tvSectionTitle.setText(R.string.trash);
                binding.fabNewNote.hide();
                return true;
            } else if (itemId == R.id.nav_profile) {
                startActivity(new Intent(this, ProfileActivity.class));
                return false;
            }
            return false;
        });
    }

    private void setupObservers() {
        viewModel.getVisibleNotes().observe(this, notes -> {
            noteAdapter.submitList(notes);
            binding.tvNotesCount.setText(notes.size() + " ghi chú hiện có");
            binding.layoutEmpty.setVisibility(notes.isEmpty() ? View.VISIBLE : View.GONE);
        });

        viewModel.getLabels().observe(this, this::updateLabelChips);

        viewModel.getIsLoading().observe(this, isLoading -> {
            binding.swipeRefresh.setRefreshing(isLoading);
        });

        viewModel.getSelectedDate().observe(this, date -> {
            if (date == null) {
                binding.chipDateFilter.setText(R.string.all_dates);
                binding.chipDateFilter.setChipIconTint(getColorStateList(R.color.primary));
            } else {
                binding.chipDateFilter.setText(DateTimeUtils.formatDateVi(date));
            }
        });

        viewModel.getMessage().observe(this, error -> {
            if (error != null && !error.isEmpty()) {
                Toast.makeText(this, error, Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void updateLabelChips(List<Label> labels) {
        binding.chipGroupLabels.removeAllViews();

        // 1. Chip "Tất cả"
        Chip allChip = new Chip(this);
        allChip.setText("Tất cả nhãn");
        allChip.setCheckable(true);
        allChip.setChecked(viewModel.getSelectedLabelId().getValue() == null);
        allChip.setOnClickListener(v -> {
            viewModel.selectLabel(null);
            binding.tvSectionTitle.setText(R.string.all_notes);
        });
        binding.chipGroupLabels.addView(allChip);

        // 2. Chips for each label
        if (labels != null) {
            String selectedId = viewModel.getSelectedLabelId().getValue();
            for (Label label : labels) {
                Chip chip = new Chip(this);
                chip.setText(label.getName());
                chip.setCheckable(true);
                chip.setChecked(label.getId().equals(selectedId));

                try {
                    int color = Color.parseColor(label.getColor());
                    chip.setChipIconResource(R.drawable.bg_circle_dot);
                    chip.setChipIconTint(ColorStateList.valueOf(color));
                } catch (Exception ignored) {}

                chip.setOnClickListener(v -> {
                    viewModel.selectLabel(label.getId());
                    binding.tvSectionTitle.setText("Nhãn: " + label.getName());
                });

                chip.setOnLongClickListener(v -> {
                    showEditLabelDialog(label);
                    return true;
                });

                binding.chipGroupLabels.addView(chip);
            }
        }

        // 3. Chip "+ Thêm nhãn"
        Chip addChip = new Chip(this);
        addChip.setText("+ Thêm nhãn");
        addChip.setChipIconResource(R.drawable.ic_add);
        addChip.setOnClickListener(v -> showAddLabelDialog());
        binding.chipGroupLabels.addView(addChip);
    }

    private void setupListeners() {
        binding.swipeRefresh.setOnRefreshListener(() -> viewModel.refreshData());

        // Toggle Grid/List
        binding.btnToggleView.setOnClickListener(v -> {
            isGridMode = !isGridMode;
            sessionManager.setViewMode(isGridMode ? "grid" : "list");
            updateLayoutManager();
        });

        // Toggle Sort
        binding.btnSort.setOnClickListener(v -> {
            viewModel.toggleSortOrder();
            String order = "newest".equals(viewModel.getSortOrder().getValue()) ? "mới nhất" : "cũ nhất";
            Toast.makeText(this, "Sắp xếp: " + order, Toast.LENGTH_SHORT).show();
        });

        // Date Filter
        binding.chipDateFilter.setOnClickListener(v -> showDatePicker());

        // Floating Action Button -> New Note
        binding.fabNewNote.setOnClickListener(v -> {
            Intent intent = new Intent(this, NoteEditorActivity.class);
            if (viewModel.getSelectedDate().getValue() != null) {
                intent.putExtra(Constants.EXTRA_NOTE_DATE, viewModel.getSelectedDate().getValue());
            }
            startActivity(intent);
        });
    }

    private void handleNoteClick(Note note) {
        if (note.isPasswordProtected()) {
            NotePasswordDialog dialog = new NotePasswordDialog(this, NotePasswordDialog.Mode.UNLOCK, new NotePasswordDialog.OnPasswordActionListener() {
                @Override
                public void onUnlock(String password) {
                    verifyAndOpenNote(note.getId(), password);
                }
                @Override public void onEnable(String p, String c) {}
                @Override public void onChange(String cur, String n, String conf) {}
                @Override public void onDisable(String cur) {}
            });
            dialog.show();
        } else {
            openNoteEditor(note.getId(), null);
        }
    }

    private void verifyAndOpenNote(String noteId, String password) {
        NoteRepository.getInstance(this).getNoteDetail(noteId, password, new Callback<NoteDetailResponse>() {
            @Override
            public void onResponse(Call<NoteDetailResponse> call, Response<NoteDetailResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getNote() != null) {
                    openNoteEditor(noteId, password);
                } else {
                    Toast.makeText(MainActivity.this, "Mật khẩu không chính xác.", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<NoteDetailResponse> call, Throwable t) {
                Toast.makeText(MainActivity.this, "Không thể xác minh mật khẩu: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void openNoteEditor(String noteId, String password) {
        Intent intent = new Intent(this, NoteEditorActivity.class);
        intent.putExtra(Constants.EXTRA_NOTE_ID, noteId);
        if (password != null) {
            intent.putExtra(Constants.EXTRA_NOTE_PASSWORD, password);
        }
        startActivity(intent);
    }

    private void showNoteQuickActions(Note note) {
        String[] options;
        if (note.isDeleted()) {
            options = new String[]{"Khôi phục ghi chú", "Xóa vĩnh viễn"};
            new AlertDialog.Builder(this)
                    .setTitle(note.getTitle())
                    .setItems(options, (dialog, which) -> {
                        if (which == 0) viewModel.restoreNote(note);
                        else if (which == 1) confirmPermanentDelete(note);
                    })
                    .show();
        } else {
            options = new String[]{
                    note.isPinned() ? "Bỏ ghim" : "Ghim lên đầu",
                    note.isPasswordProtected() ? "Đổi / Gỡ mật khẩu khóa" : "Đặt mật khẩu bảo vệ",
                    "Chia sẻ ghi chú",
                    "Chuyển vào thùng rác"
            };
            new AlertDialog.Builder(this)
                    .setTitle(note.getTitle())
                    .setItems(options, (dialog, which) -> {
                        switch (which) {
                            case 0:
                                viewModel.togglePin(note);
                                break;
                            case 1:
                                handlePasswordManagement(note);
                                break;
                            case 2:
                                new ShareBottomSheet(note.getId()).show(getSupportFragmentManager(), "share_bottom_sheet");
                                break;
                            case 3:
                                viewModel.deleteNote(note, null);
                                break;
                        }
                    })
                    .show();
        }
    }

    private void confirmPermanentDelete(Note note) {
        new AlertDialog.Builder(this)
                .setTitle("Xóa vĩnh viễn")
                .setMessage("Ghi chú này sẽ bị xóa hoàn toàn và không thể khôi phục. Bạn có chắc không?")
                .setPositiveButton("Xóa luôn", (dialog, which) -> viewModel.deletePermanently(note, null))
                .setNegativeButton("Hủy", null)
                .show();
    }

    private void handlePasswordManagement(Note note) {
        NotePasswordDialog.Mode mode = note.isPasswordProtected() ? NotePasswordDialog.Mode.CHANGE : NotePasswordDialog.Mode.ENABLE;
        NotePasswordDialog dialog = new NotePasswordDialog(this, mode, new NotePasswordDialog.OnPasswordActionListener() {
            @Override public void onUnlock(String password) {}
            @Override
            public void onEnable(String password, String confirm) {
                NoteRepository.getInstance(MainActivity.this).enableNotePassword(note.getId(), password, confirm, new Callback<NoteDetailResponse>() {
                    @Override
                    public void onResponse(Call<NoteDetailResponse> call, Response<NoteDetailResponse> response) {
                        if (response.isSuccessful() && response.body() != null && response.body().getNote() != null) {
                            viewModel.updateNoteInList(response.body().getNote());
                            Toast.makeText(MainActivity.this, "Đã thiết lập mật khẩu bảo vệ!", Toast.LENGTH_SHORT).show();
                        }
                    }
                    @Override public void onFailure(Call<NoteDetailResponse> call, Throwable t) {}
                });
            }
            @Override
            public void onChange(String currentPassword, String newPassword, String confirmNew) {
                NoteRepository.getInstance(MainActivity.this).changeNotePassword(note.getId(), currentPassword, newPassword, confirmNew, new Callback<NoteDetailResponse>() {
                    @Override
                    public void onResponse(Call<NoteDetailResponse> call, Response<NoteDetailResponse> response) {
                        if (response.isSuccessful()) {
                            Toast.makeText(MainActivity.this, "Đã đổi mật khẩu thành công!", Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(MainActivity.this, "Mật khẩu hiện tại không đúng.", Toast.LENGTH_SHORT).show();
                        }
                    }
                    @Override public void onFailure(Call<NoteDetailResponse> call, Throwable t) {}
                });
            }
            @Override
            public void onDisable(String currentPassword) {
                NoteRepository.getInstance(MainActivity.this).disableNotePassword(note.getId(), currentPassword, new Callback<NoteDetailResponse>() {
                    @Override
                    public void onResponse(Call<NoteDetailResponse> call, Response<NoteDetailResponse> response) {
                        if (response.isSuccessful() && response.body() != null && response.body().getNote() != null) {
                            viewModel.updateNoteInList(response.body().getNote());
                            Toast.makeText(MainActivity.this, "Đã gỡ bỏ mật khẩu bảo vệ!", Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(MainActivity.this, "Mật khẩu không đúng.", Toast.LENGTH_SHORT).show();
                        }
                    }
                    @Override public void onFailure(Call<NoteDetailResponse> call, Throwable t) {}
                });
            }
        });
        dialog.show();
    }

    private void showDatePicker() {
        if (viewModel.getSelectedDate().getValue() != null) {
            new AlertDialog.Builder(this)
                    .setTitle("Lọc ngày")
                    .setMessage("Bạn muốn chọn ngày khác hay xem tất cả các ngày?")
                    .setPositiveButton("Chọn ngày khác", (d, w) -> openCalendar())
                    .setNegativeButton("Xem tất cả các ngày", (d, w) -> viewModel.setDateFilter(null))
                    .show();
        } else {
            openCalendar();
        }
    }

    private void openCalendar() {
        Calendar cal = Calendar.getInstance();
        DatePickerDialog dialog = new DatePickerDialog(this, (view, year, month, dayOfMonth) -> {
            String formatted = String.format(Locale.US, "%04d-%02d-%02d", year, month + 1, dayOfMonth);
            viewModel.setDateFilter(formatted);
        }, cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH));
        dialog.show();
    }

    private void showAddLabelDialog() {
        LabelManagerDialog dialog = new LabelManagerDialog(this, null, new LabelManagerDialog.OnLabelSaveListener() {
            @Override
            public void onSave(String name, String color) {
                viewModel.createLabel(name, color);
            }
            @Override public void onDelete(String labelId) {}
        });
        dialog.show();
    }

    private void showEditLabelDialog(Label label) {
        LabelManagerDialog dialog = new LabelManagerDialog(this, label, new LabelManagerDialog.OnLabelSaveListener() {
            @Override
            public void onSave(String name, String color) {
                viewModel.updateLabel(label.getId(), name, color);
            }
            @Override
            public void onDelete(String labelId) {
                viewModel.deleteLabel(labelId);
            }
        });
        dialog.show();
    }

    // Realtime Socket.IO Callbacks
    @Override
    public void onNoteUpdated(Note note, String updatedBy) {
        runOnUiThread(() -> viewModel.updateNoteInList(note));
    }

    @Override
    public void onNoteShared(String noteId, String title, String sharedBy, String permission) {
        runOnUiThread(() -> viewModel.refreshData());
    }
}
