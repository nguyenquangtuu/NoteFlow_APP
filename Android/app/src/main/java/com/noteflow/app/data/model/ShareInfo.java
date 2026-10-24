package com.noteflow.app.data.model;

import com.google.gson.annotations.SerializedName;
import java.io.Serializable;

public class ShareInfo implements Serializable {
    @SerializedName("email")
    private String email;

    @SerializedName("permission")
    private String permission; // "viewer" | "editor"

    public ShareInfo() {}

    public ShareInfo(String email, String permission) {
        this.email = email;
        this.permission = permission;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPermission() { return permission != null ? permission : "viewer"; }
    public void setPermission(String permission) { this.permission = permission; }
}
