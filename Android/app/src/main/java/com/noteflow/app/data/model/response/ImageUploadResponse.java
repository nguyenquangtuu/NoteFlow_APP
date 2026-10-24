package com.noteflow.app.data.model.response;

import com.google.gson.annotations.SerializedName;
import java.util.ArrayList;
import java.util.List;

public class ImageUploadResponse extends ApiResponse {
    @SerializedName("images")
    private List<String> images = new ArrayList<>();

    public List<String> getImages() { return images != null ? images : new ArrayList<>(); }
    public void setImages(List<String> images) { this.images = images; }
}
