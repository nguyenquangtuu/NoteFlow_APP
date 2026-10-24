package com.noteflow.app.data.model.response;

import com.google.gson.annotations.SerializedName;
import com.noteflow.app.data.model.User;

public class AuthResponse extends ApiResponse {
    @SerializedName("token")
    private String token;

    @SerializedName("activationToken")
    private String activationToken;

    @SerializedName("user")
    private User user;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getActivationToken() { return activationToken; }
    public void setActivationToken(String activationToken) { this.activationToken = activationToken; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
