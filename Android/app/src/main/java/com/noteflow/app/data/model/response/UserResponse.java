package com.noteflow.app.data.model.response;

import com.google.gson.annotations.SerializedName;
import com.noteflow.app.data.model.User;

public class UserResponse extends ApiResponse {
    @SerializedName("user")
    private User user;

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
