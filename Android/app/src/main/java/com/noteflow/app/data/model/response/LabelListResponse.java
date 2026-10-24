package com.noteflow.app.data.model.response;

import com.google.gson.annotations.SerializedName;
import com.noteflow.app.data.model.Label;
import java.util.ArrayList;
import java.util.List;

public class LabelListResponse extends ApiResponse {
    @SerializedName("labels")
    private List<Label> labels = new ArrayList<>();

    public List<Label> getLabels() { return labels != null ? labels : new ArrayList<>(); }
    public void setLabels(List<Label> labels) { this.labels = labels; }
}
