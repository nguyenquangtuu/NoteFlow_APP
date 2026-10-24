package com.noteflow.app.data.model.response;

import com.google.gson.annotations.SerializedName;
import com.noteflow.app.data.model.ShareInfo;
import java.util.ArrayList;
import java.util.List;

public class SharesResponse extends ApiResponse {
    @SerializedName("publicPermission")
    private String publicPermission; // "none" | "viewer" | "editor"

    @SerializedName("shareToken")
    private String shareToken;

    @SerializedName("shares")
    private List<ShareInfo> shares = new ArrayList<>();

    public String getPublicPermission() { return publicPermission != null ? publicPermission : "none"; }
    public void setPublicPermission(String publicPermission) { this.publicPermission = publicPermission; }

    public String getShareToken() { return shareToken; }
    public void setShareToken(String shareToken) { this.shareToken = shareToken; }

    public List<ShareInfo> getShares() { return shares != null ? shares : new ArrayList<>(); }
    public void setShares(List<ShareInfo> shares) { this.shares = shares; }
}
