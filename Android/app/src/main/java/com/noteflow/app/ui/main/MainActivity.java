package com.noteflow.app.ui.main;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.core.view.GravityCompat;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;

import com.noteflow.app.R;
import com.noteflow.app.data.model.Label;
import com.noteflow.app.data.model.Note;
import com.noteflow.app.data.model.response.NoteDetailResponse;
import com.noteflow.app.data.repository.NoteRepository;
import com.noteflow.app.data.session.SessionManager;
import com.noteflow.app.databinding.ActivityMainBinding;
import com.noteflow.app.realtime.SocketManager;
import com.noteflow.app.ui.auth.LoginActivity;
import com.noteflow.app.ui.dialogs.LabelManagerDialog;
import com.noteflow.app.ui.dialogs.NotePasswordDialog;
import com.noteflow.app.ui.dialogs.ShareBottomSheet;
import com.noteflow.app.ui.editor.NoteEditorActivity;
import com.noteflow.app.ui.profile.ProfileActivity;
import com.noteflow.app.utils.Constants;
import com.noteflow.app.utils.DateTimeUtils;

import java.util.Calendar;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements SocketManager.SocketEventListener {

    private ActivityMainBinding binding;
    private MainViewModel viewModel;
    private SessionManager sessionManager;
    private NoteAdapter noteAdapter;
    private LabelDrawerAdapter labelDrawerAdapter;
    private boolean isGridMode = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);
        viewModel = new ViewModelProvider(this).get(MainViewModel.class);

        isGridMode = "grid".equalsIgnoreCase(sessionManager.getViewMode());

        setupDrawerHeader();
        setupRecyclerViews();
        setupToolbarAndSearch();
        setupObservers();
        setupListeners();

        SocketManager.getInstance().addListener(this);
        viewModel.refreshData();
    }

    @Override
    protected void onResume() {
        super.onResume();
        setupDrawerHeader();
        viewModel.refreshData();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SocketManager.getInstance().removeListener(this);
    }

    private void setupDrawerHeader() {
        binding.tvDrawerUserName.setText(sessionManager.getUserName());
        binding.tvDrawerUserEmail.setText(sessionManager.getUserEmail());
    }

    private void setupRecyclerViews() {
        // Notes Adapter
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

        // Labels Adapter in Drawer
        labelDrawerAdapter = new LabelDrawerAdapter(new LabelDrawerAdapter.OnLabelClickListener() {
            @Override
            public void onLabelClick(Label label) {
                viewModel.selectLabel(label.getId());
                binding.tvSectionTitle.setText("Nhãn: " + label.getName());
                binding.drawerLayout.closeDrawer(GravityCompat.START);
            }

            @Override
            public void onLabelOptionsClick(Label label) {
                showEditLabelDialog(label);
            }
        });
        binding.rvDrawerLabels.setLayoutManager(new LinearLayoutManager(this));
        binding.rvDrawerLabels.setAdapter(labelDrawerAdapter);
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
        binding.toolbar.setNavigationOnClickListener(v -> binding.drawerLayout.openDrawer(GravityCompat.START));

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

    private void setupObservers() {
        viewModel.getVisibleNotes().observe(this, notes -> {
            noteAdapter.submitList(notes);
            binding.tvNotesCount.setText(notes.size() + " ghi chú hiện có");
            binding.layoutEmpty.setVisibility(notes.isEmpty() ? View.VISIBLE : View.GONE);
        });

        viewModel.getLabels().observe(this, labels -> {
            labelDrawerAdapter.setLabels(labels);
        });

        viewModel.getIsLoading().observe(this, isLoading -> {
            binding.swipeRefresh.setRefreshing(isLoading);
        });

        viewModel.getMessage().observe(this, msg -> {
            if (msg != null && !msg.isEmpty()) {
                Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
            }
        });

        viewModel.getSelectedDate().observe(this, date -> {
            if (date == null || date.isEmpty()) {
                binding.chipDateFilter.setText(getString(R.string.all_dates));
            } else {
                binding.chipDateFilter.setText("Ngày: " + DateTimeUtils.formatDisplayDate(date));
            }
        });
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

        // Drawer Menu Click Items
        binding.navAllNotes.setOnClickListener(v -> {
            viewModel.setFilter(MainViewModel.FilterType.ALL);
            binding.tvSectionTitle.setText(R.string.all_notes);
            binding.drawerLayout.closeDrawer(GravityCompat.START);
        });

        binding.navPinned.setOnClickListener(v -> {
            viewModel.setFilter(MainViewModel.FilterType.PINNED);
            binding.tvSectionTitle.setText(R.string.pinned_notes);
            binding.drawerLayout.closeDrawer(GravityCompat.START);
        });

        binding.navShared.setOnClickListener(v -> {
            viewModel.setFilter(MainViewModel.FilterType.SHARED);
            binding.tvSectionTitle.setText(R.string.shared_with_me);
            binding.drawerLayout.closeDrawer(GravityCompat.START);
        });

        binding.navTrash.setOnClickListener(v -> {
            viewModel.setFilter(MainViewModel.FilterType.TRASH);
            binding.tvSectionTitle.setText(R.string.trash);
            binding.drawerLayout.closeDrawer(GravityCompat.START);
        });

        binding.btnAddLabel.setOnClickListener(v -> showAddLabelDialog());

        binding.navProfile.setOnClickListener(v -> {
            binding.drawerLayout.closeDrawer(GravityCompat.START);
            startActivity(new Intent(this, ProfileActivity.class));
        });

        binding.navLogout.setOnClickListener(v -> {
            binding.drawerLayout.closeDrawer(GravityCompat.START);
            new AlertDialog.Builder(this)
                    .setTitle("Đăng xuất")
                    .setMessage("Bạn có chắc chắn muốn đăng xuất?")
                    .setPositiveButton("Đăng xuất", (dialog, which) -> {
                        SocketManager.getInstance().disconnect();
                        sessionManager.clear();
                        Intent intent = new Intent(this, LoginActivity.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        startActivity(intent);
                    })
                    .setNegativeButton("Hủy", null)
                    .show();
        });
    }

    private void handleNoteClick(Note note) {
        if (note.isPasswordProtected()) {
            NotePasswordDialog dialog = new NotePasswordDialog(this, NotePasswordDialog.Mode.UNLOCK, new NotePasswordDialog.OnPasswordActionListener() {
                @Override
                public void onUnlock(String password) {
                    NoteRepository repo = new NoteRepository(MainActivity.this);
                    repo.verifyNotePassword(note.getId(), password, new Callback<NoteDetailResponse>() {
                        @Override
                        public void onResponse(Call<NoteDetailResponse> call, Response<NoteDetailResponse> response) {
                            if (response.isSuccessful() && response.body() != null && response.body().getNote() != null) {
                                openEditor(response.body().getNote());
                            } else {
                                Toast.makeText(MainActivity.this, "Mật khẩu ghi chú không đúng!", Toast.LENGTH_SHORT).show();
                            }
                        }

                        @Override
                        public void onFailure(Call<NoteDetailResponse> call, Throwable t) {
                            Toast.makeText(MainActivity.this, "Lỗi xác thực mật khẩu.", Toast.LENGTH_SHORT).show();
                        }
                    });
                }
                @Override public void onEnable(String p, String c) {}
                @Override public void onChange(String cur, String n, String conf) {}
                @Override public void onDisable(String cur) {}
            });
            dialog.show();
        } else {
            openEditor(note);
        }
    }

    private void openEditor(Note note) {
        Intent intent = new Intent(this, NoteEditorActivity.class);
        intent.putExtra(Constants.EXTRA_NOTE_ID, note.getId());
        intent.putExtra("extra_note_data", note);
        if (note.isSharedWithMe() && "viewer".equalsIgnoreCase(note.getSharedPermission())) {
            intent.putExtra(Constants.EXTRA_IS_READ_ONLY, true);
        }
        startActivity(intent);
    }

    private void showNoteQuickActions(Note note) {
        boolean isTrash = (viewModel.getCurrentFilter().getValue() == MainViewModel.FilterType.TRASH);

        String[] options;
        if (isTrash) {
            options = new String[]{"Khôi phục ghi chú", "Xóa vĩnh viễn"};
        } else {
            options = new String[]{
                    note.isPinned() ? "Bỏ ghim" : "Ghim lên đầu",
                    "Chia sẻ",
                    "Chuyển vào thùng rác"
            };
        }

        new AlertDialog.Builder(this)
                .setTitle(note.getTitle().isEmpty() ? "Tùy chọn ghi chú" : note.getTitle())
                .setItems(options, (dialog, which) -> {
                    if (isTrash) {
                        if (which == 0) viewModel.restoreNote(note);
                        else if (which == 1) promptPasswordForDelete(note, true);
                    } else {
                        if (which == 0) viewModel.togglePin(note);
                        else if (which == 1) new ShareBottomSheet(note.getId()).show(getSupportFragmentManager(), "ShareBottomSheet");
                        else if (which == 2) {
                            if (note.isPasswordProtected()) {
                                promptPasswordForDelete(note, false);
                            } else {
                                viewModel.deleteNote(note, null);
                            }
                        }
                    }
                })
                .show();
    }

    private void promptPasswordForDelete(Note note, boolean isPermanent) {
        NotePasswordDialog dialog = new NotePasswordDialog(this, NotePasswordDialog.Mode.UNLOCK, new NotePasswordDialog.OnPasswordActionListener() {
            @Override
            public void onUnlock(String password) {
                if (isPermanent) viewModel.deletePermanently(note, password);
                else viewModel.deleteNote(note, password);
            }
            @Override public void onEnable(String p, String c) {}
            @Override public void onChange(String cur, String n, String conf) {}
            @Override public void onDisable(String cur) {}
        });
        dialog.show();
    }

    private void showDatePicker() {
        if (viewModel.getSelectedDate().getValue() != null) {
            // Already filtered by date, offer to reset
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
