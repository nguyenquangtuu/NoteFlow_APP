package com.noteflow.app.ui.main;

import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.noteflow.app.data.model.Label;
import com.noteflow.app.databinding.ItemLabelDrawerBinding;

import java.util.ArrayList;
import java.util.List;

public class LabelDrawerAdapter extends RecyclerView.Adapter<LabelDrawerAdapter.LabelViewHolder> {

    public interface OnLabelClickListener {
        void onLabelClick(Label label);
        void onLabelOptionsClick(Label label);
    }

    private final List<Label> labelList = new ArrayList<>();
    private final OnLabelClickListener listener;
    private String selectedLabelId = null;

    public LabelDrawerAdapter(OnLabelClickListener listener) {
        this.listener = listener;
    }

    public void setLabels(List<Label> labels) {
        labelList.clear();
        if (labels != null) {
            labelList.addAll(labels);
        }
        notifyDataSetChanged();
    }

    public void setSelectedLabelId(String labelId) {
        this.selectedLabelId = labelId;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public LabelViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemLabelDrawerBinding binding = ItemLabelDrawerBinding.inflate(
                LayoutInflater.from(parent.getContext()),
                parent,
                false
        );
        return new LabelViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull LabelViewHolder holder, int position) {
        holder.bind(labelList.get(position));
    }

    @Override
    public int getItemCount() {
        return labelList.size();
    }

    class LabelViewHolder extends RecyclerView.ViewHolder {
        private final ItemLabelDrawerBinding binding;

        public LabelViewHolder(ItemLabelDrawerBinding binding) {
            super(binding.getRoot());
            this.binding = binding;

            binding.getRoot().setOnClickListener(v -> {
                int pos = getAdapterPosition();
                if (pos != RecyclerView.NO_POSITION && listener != null) {
                    listener.onLabelClick(labelList.get(pos));
                }
            });

            binding.ivLabelMenu.setOnClickListener(v -> {
                int pos = getAdapterPosition();
                if (pos != RecyclerView.NO_POSITION && listener != null) {
                    listener.onLabelOptionsClick(labelList.get(pos));
                }
            });
        }

        public void bind(Label label) {
            binding.tvLabelName.setText(label.getName());
            binding.tvNoteCount.setText(String.valueOf(label.getNoteCount()));

            // Setup colored circle
            GradientDrawable dot = new GradientDrawable();
            dot.setShape(GradientDrawable.OVAL);
            try {
                dot.setColor(Color.parseColor(label.getColor()));
            } catch (Exception e) {
                dot.setColor(Color.parseColor("#4F46E5"));
            }
            binding.viewLabelColor.setBackground(dot);

            // Selection state
            boolean isSelected = label.getId().equals(selectedLabelId);
            if (isSelected) {
                binding.getRoot().setBackgroundColor(Color.parseColor("#EEF2FF"));
                binding.tvLabelName.setTextColor(Color.parseColor("#4F46E5"));
                binding.tvLabelName.setTextAppearance(android.R.style.TextAppearance_Material_Body1);
            } else {
                binding.getRoot().setBackgroundColor(Color.TRANSPARENT);
                binding.tvLabelName.setTextColor(Color.parseColor("#0F172A"));
            }
        }
    }
}
