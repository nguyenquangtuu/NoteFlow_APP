package com.noteflow.app.ui.dialogs;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.noteflow.app.data.model.ShareInfo;
import com.noteflow.app.data.model.response.ApiResponse;
import com.noteflow.app.data.model.response.ShareLinkResponse;
import com.noteflow.app.data.model.response.SharesResponse;
import com.noteflow.app.data.repository.NoteRepository;
import com.noteflow.app.databinding.BottomSheetShareBinding;
import com.noteflow.app.databinding.ItemShareUserBinding;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ShareBottomSheet extends BottomSheetDialogFragment {

    private final String noteId;
    private BottomSheetShareBinding binding;
    private NoteRepository noteRepository;
    private String shareUrl = "";
    private final List<ShareInfo> shareList = new ArrayList<>();
    private ShareUsersAdapter adapter;

    public ShareBottomSheet(String noteId) {
        this.noteId = noteId;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = BottomSheetShareBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        noteRepository = new NoteRepository(requireContext());

        setupSpinners();
        setupRecyclerView();
        loadShareData();
        setupListeners();
    }

    private void setupSpinners() {
        // Public Permission Spinner
        String[] publicOptions = {"Tắt (Không công khai)", "Chỉ xem (Viewer)", "Được sửa (Editor)"};
        ArrayAdapter<String> publicAdapter = new ArrayAdapter<>(requireContext(), android.R.layout.simple_spinner_dropdown_item, publicOptions);
        binding.spinnerPublicPermission.setAdapter(publicAdapter);

        // Invite Permission Spinner
        String[] inviteOptions = {"Chỉ xem", "Chỉnh sửa"};
        ArrayAdapter<String> inviteAdapter = new ArrayAdapter<>(requireContext(), android.R.layout.simple_spinner_dropdown_item, inviteOptions);
        binding.spinnerInvitePermission.setAdapter(inviteAdapter);
    }

    private void setupRecyclerView() {
        adapter = new ShareUsersAdapter();
        binding.rvShareUsers.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.rvShareUsers.setAdapter(adapter);
    }

    private void loadShareData() {
        noteRepository.getNoteShares(noteId, new Callback<SharesResponse>() {
            @Override
            public void onResponse(Call<SharesResponse> call, Response<SharesResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    SharesResponse data = response.body();
                    String perm = data.getPublicPermission();
                    if ("editor".equals(perm)) binding.spinnerPublicPermission.setSelection(2);
                    else if ("viewer".equals(perm)) binding.spinnerPublicPermission.setSelection(1);
                    else binding.spinnerPublicPermission.setSelection(0);

                    if (data.getShareToken() != null && !data.getShareToken().isEmpty()) {
                        shareUrl = "http://localhost:3000/chia-se/" + data.getShareToken();
                    }

                    shareList.clear();
                    shareList.addAll(data.getShares());
                    adapter.notifyDataSetChanged();
                }
            }

            @Override
            public void onFailure(Call<SharesResponse> call, Throwable t) {}
        });
    }

    private void setupListeners() {
        binding.spinnerPublicPermission.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String permission = "none";
                if (position == 1) permission = "viewer";
                else if (position == 2) permission = "editor";

                noteRepository.updatePublicPermission(noteId, permission, null);
                if (position > 0 && shareUrl.isEmpty()) {
                    noteRepository.generateShareLink(noteId, new Callback<ShareLinkResponse>() {
                        @Override
                        public void onResponse(Call<ShareLinkResponse> call, Response<ShareLinkResponse> response) {
                            if (response.isSuccessful() && response.body() != null) {
                                shareUrl = response.body().getShareUrl();
                            }
                        }
                        @Override
                        public void onFailure(Call<ShareLinkResponse> call, Throwable t) {}
                    });
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {}
        });

        binding.btnCopyLink.setOnClickListener(v -> {
            if (shareUrl.isEmpty()) {
                noteRepository.generateShareLink(noteId, new Callback<ShareLinkResponse>() {
                    @Override
                    public void onResponse(Call<ShareLinkResponse> call, Response<ShareLinkResponse> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            shareUrl = response.body().getShareUrl();
                            copyToClipboard(shareUrl);
                        }
                    }
                    @Override
                    public void onFailure(Call<ShareLinkResponse> call, Throwable t) {}
                });
            } else {
                copyToClipboard(shareUrl);
            }
        });

        binding.btnAddUser.setOnClickListener(v -> {
            String email = binding.etInviteEmail.getText() != null ? binding.etInviteEmail.getText().toString().trim() : "";
            if (email.isEmpty()) {
                Toast.makeText(getContext(), "Vui lòng nhập email", Toast.LENGTH_SHORT).show();
                return;
            }
            String permission = binding.spinnerInvitePermission.getSelectedItemPosition() == 1 ? "editor" : "viewer";

            noteRepository.addShareUser(noteId, email, permission, new Callback<ApiResponse>() {
                @Override
                public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                    if (response.isSuccessful()) {
                        binding.etInviteEmail.setText("");
                        shareList.add(new ShareInfo(email, permission));
                        adapter.notifyDataSetChanged();
                        Toast.makeText(getContext(), "Đã chia sẻ thành công!", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(getContext(), "Không tìm thấy người dùng này", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<ApiResponse> call, Throwable t) {}
            });
        });
    }

    private void copyToClipboard(String text) {
        ClipboardManager clipboard = (ClipboardManager) requireContext().getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("NoteFlow Share Link", text);
        clipboard.setPrimaryClip(clip);
        Toast.makeText(getContext(), "Đã sao chép liên kết vào bộ nhớ tạm!", Toast.LENGTH_SHORT).show();
    }

    class ShareUsersAdapter extends RecyclerView.Adapter<ShareUsersAdapter.ViewHolder> {
        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            ItemShareUserBinding b = ItemShareUserBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false);
            return new ViewHolder(b);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            ShareInfo info = shareList.get(position);
            holder.b.tvEmail.setText(info.getEmail());
            holder.b.tvPermission.setText("editor".equals(info.getPermission()) ? "Được chỉnh sửa (Editor)" : "Chỉ xem (Viewer)");
            holder.b.btnRemoveShare.setOnClickListener(v -> {
                noteRepository.removeShareUser(noteId, info.getEmail(), new Callback<ApiResponse>() {
                    @Override
                    public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                        shareList.remove(info);
                        notifyDataSetChanged();
                    }
                    @Override
                    public void onFailure(Call<ApiResponse> call, Throwable t) {}
                });
            });
        }

        @Override
        public int getItemCount() { return shareList.size(); }

        class ViewHolder extends RecyclerView.ViewHolder {
            ItemShareUserBinding b;
            ViewHolder(ItemShareUserBinding b) { super(b.getRoot()); this.b = b; }
        }
    }
}
