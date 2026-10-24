package com.noteflow.app.data.model.response;

import com.google.gson.annotations.SerializedName;
import com.noteflow.app.data.model.Label;

public class LabelDetailResponse extends ApiResponse {
    @SerializedName("label")
    private Label label;

    public Label getLabel() { return label; }
    public void setLabel(Label label) { this.label = label; }
}
