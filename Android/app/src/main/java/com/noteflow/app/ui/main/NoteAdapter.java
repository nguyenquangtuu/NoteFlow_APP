package com.noteflow.app.ui.main;

import android.graphics.Color;
import android.content.res.ColorStateList;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.chip.Chip;
import com.noteflow.app.data.model.Label;
import com.noteflow.app.data.model.Note;
import com.noteflow.app.databinding.ItemNoteBinding;
import com.noteflow.app.utils.DateTimeUtils;

import java.util.Objects;

public class NoteAdapter extends ListAdapter<Note, NoteAdapter.NoteViewHolder> {

    public interface OnNoteClickListener {
        void onNoteClick(Note note);
        void onNoteLongClick(Note note);
    }

    private final OnNoteClickListener listener;

    public NoteAdapter(OnNoteClickListener listener) {
        super(DIFF_CALLBACK);
        this.listener = listener;
    }

    private static final DiffUtil.ItemCallback<Note> DIFF_CALLBACK = new DiffUtil.ItemCallback<Note>() {
        @Override
        public boolean areItemsTheSame(@NonNull Note oldItem, @NonNull Note newItem) {
            return Objects.equals(oldItem.getId(), newItem.getId());
        }

        @Override
        public boolean areContentsTheSame(@NonNull Note oldItem, @NonNull Note newItem) {
            return Objects.equals(oldItem.getTitle(), newItem.getTitle()) &&
                    Objects.equals(oldItem.getContent(), newItem.getContent()) &&
                    oldItem.isPinned() == newItem.isPinned() &&
                    oldItem.isPasswordProtected() == newItem.isPasswordProtected() &&
                    Objects.equals(oldItem.getNoteDate(), newItem.getNoteDate()) &&
                    Objects.equals(oldItem.getUpdatedAt(), newItem.getUpdatedAt()) &&
                    Objects.equals(oldItem.getLabels(), newItem.getLabels());
        }
    };

    @NonNull
    @Override
    public NoteViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemNoteBinding binding = ItemNoteBinding.inflate(
                LayoutInflater.from(parent.getContext()),
                parent,
                false
        );
        return new NoteViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull NoteViewHolder holder, int position) {
        holder.bind(getItem(position));
    }

    class NoteViewHolder extends RecyclerView.ViewHolder {
        private final ItemNoteBinding binding;

        public NoteViewHolder(ItemNoteBinding binding) {
            super(binding.getRoot());
            this.binding = binding;

            binding.getRoot().setOnClickListener(v -> {
                int pos = getAdapterPosition();
                if (pos != RecyclerView.NO_POSITION && listener != null) {
                    listener.onNoteClick(getItem(pos));
                }
            });

            binding.getRoot().setOnLongClickListener(v -> {
                int pos = getAdapterPosition();
                if (pos != RecyclerView.NO_POSITION && listener != null) {
                    listener.onNoteLongClick(getItem(pos));
                    return true;
                }
                return false;
            });
        }

        public void bind(Note note) {
            binding.tvTitle.setText(note.getTitle().isEmpty() ? "(Không có tiêu đề)" : note.getTitle());

            if (note.isPasswordProtected()) {
                binding.tvContent.setText("🔒 Nội dung đã được bảo vệ bằng mật khẩu.");
            } else {
                String contentSnippet = note.getContent();
                if (contentSnippet.length() > 150) {
                    contentSnippet = contentSnippet.substring(0, 150) + "...";
                }
                binding.tvContent.setText(contentSnippet.isEmpty() ? "(Ghi chú trống)" : contentSnippet);
            }

            binding.ivPinned.setVisibility(note.isPinned() ? View.VISIBLE : View.GONE);
            binding.ivLocked.setVisibility(note.isPasswordProtected() ? View.VISIBLE : View.GONE);
            binding.ivShared.setVisibility(note.isSharedWithMe() ? View.VISIBLE : View.GONE);

            if (note.isSharedWithMe()) {
                binding.tvSharedInfo.setVisibility(View.VISIBLE);
                String owner = note.getOwnerName() != null ? note.getOwnerName() : (note.getOwnerEmail() != null ? note.getOwnerEmail() : "Người dùng");
                binding.tvSharedInfo.setText("Chia sẻ bởi: " + owner);
            } else {
                binding.tvSharedInfo.setVisibility(View.GONE);
            }

            binding.tvDate.setText(DateTimeUtils.formatDisplayDate(note.getNoteDate()));

            // Render Labels as small chips
            binding.chipGroupLabels.removeAllViews();
            if (note.getLabels() != null && !note.getLabels().isEmpty()) {
                binding.chipGroupLabels.setVisibility(View.VISIBLE);
                for (Label label : note.getLabels()) {
                    Chip chip = new Chip(itemView.getContext());
                    chip.setText(label.getName());
                    chip.setTextSize(11);
                    chip.setEnsureMinTouchTargetSize(false);
                    try {
                        int color = Color.parseColor(label.getColor());
                        chip.setChipBackgroundColor(ColorStateList.valueOf(Color.argb(35, Color.red(color), Color.green(color), Color.blue(color))));
                        chip.setTextColor(color);
                    } catch (Exception e) {
                        chip.setChipBackgroundColor(ColorStateList.valueOf(Color.parseColor("#EEF2FF")));
                        chip.setTextColor(Color.parseColor("#4F46E5"));
                    }
                    binding.chipGroupLabels.addView(chip);
                }
            } else {
                binding.chipGroupLabels.setVisibility(View.GONE);
            }
        }
    }
}
