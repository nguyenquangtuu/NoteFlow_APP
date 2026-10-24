package com.noteflow.app.data.model.response;

import com.google.gson.annotations.SerializedName;

public class ApiResponse {
    @SerializedName("message")
    private String message;

    public String getMessage() { return message != null ? message : ""; }
    public void setMessage(String message) { this.message = message; }
}
