package com.noteflow.app.data.model.response;

import com.google.gson.annotations.SerializedName;

public class ShareLinkResponse extends ApiResponse {
    @SerializedName("shareUrl")
    private String shareUrl;

    public String getShareUrl() { return shareUrl; }
    public void setShareUrl(String shareUrl) { this.shareUrl = shareUrl; }
}
