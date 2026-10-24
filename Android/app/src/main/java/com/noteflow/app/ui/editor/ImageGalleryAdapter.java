package com.noteflow.app.ui.editor;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.noteflow.app.R;
import com.noteflow.app.databinding.ItemImagePreviewBinding;
import com.noteflow.app.utils.Constants;

import java.util.ArrayList;
import java.util.List;

public class ImageGalleryAdapter extends RecyclerView.Adapter<ImageGalleryAdapter.ImageViewHolder> {

    public interface OnImageClickListener {
        void onImageClick(String imageUrl);
    }

    private final List<String> images = new ArrayList<>();
    private final OnImageClickListener listener;

    public ImageGalleryAdapter(OnImageClickListener listener) {
        this.listener = listener;
    }

    public void setImages(List<String> newImages) {
        images.clear();
        if (newImages != null) {
            images.addAll(newImages);
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ImageViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemImagePreviewBinding b = ItemImagePreviewBinding.inflate(
                LayoutInflater.from(parent.getContext()),
                parent,
                false
        );
        return new ImageViewHolder(b);
    }

    @Override
    public void onBindViewHolder(@NonNull ImageViewHolder holder, int position) {
        String path = images.get(position);
        String fullUrl = path.startsWith("http") ? path : (Constants.SERVER_HOST + path);

        Glide.with(holder.itemView.getContext())
                .load(fullUrl)
                .placeholder(R.drawable.ic_image)
                .error(R.drawable.ic_image)
                .into(holder.b.ivNoteImage);

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) listener.onImageClick(fullUrl);
        });
    }

    @Override
    public int getItemCount() {
        return images.size();
    }

    static class ImageViewHolder extends RecyclerView.ViewHolder {
        ItemImagePreviewBinding b;
        ImageViewHolder(ItemImagePreviewBinding b) { super(b.getRoot()); this.b = b; }
    }
}
