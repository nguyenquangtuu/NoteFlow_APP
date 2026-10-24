package com.noteflow.app.data.model;

import com.google.gson.annotations.SerializedName;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Note implements Serializable {
    @SerializedName("id")
    private String id;

    @SerializedName("title")
    private String title;

    @SerializedName("content")
    private String content;

    @SerializedName("noteDate")
    private String noteDate;

    @SerializedName("isPinned")
    private boolean isPinned;

    @SerializedName("pinnedAt")
    private String pinnedAt;

    @SerializedName("isDeleted")
    private boolean isDeleted;

    @SerializedName("isPasswordProtected")
    private boolean isPasswordProtected;

    @SerializedName("images")
    private List<String> images = new ArrayList<>();

    @SerializedName("shareToken")
    private String shareToken;

    @SerializedName("updatedBy")
    private String updatedBy;

    @SerializedName("labels")
    private List<Label> labels = new ArrayList<>();

    @SerializedName("isSharedWithMe")
    private boolean isSharedWithMe;

    @SerializedName("sharedPermission")
    private String sharedPermission;

    @SerializedName("sharedAt")
    private String sharedAt;

    @SerializedName("ownerName")
    private String ownerName;

    @SerializedName("ownerEmail")
    private String ownerEmail;

    @SerializedName("createdAt")
    private String createdAt;

    @SerializedName("updatedAt")
    private String updatedAt;

    public Note() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title != null ? title : ""; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content != null ? content : ""; }
    public void setContent(String content) { this.content = content; }

    public String getNoteDate() { return noteDate; }
    public void setNoteDate(String noteDate) { this.noteDate = noteDate; }

    public boolean isPinned() { return isPinned; }
    public void setPinned(boolean pinned) { isPinned = pinned; }

    public String getPinnedAt() { return pinnedAt; }
    public void setPinnedAt(String pinnedAt) { this.pinnedAt = pinnedAt; }

    public boolean isDeleted() { return isDeleted; }
    public void setDeleted(boolean deleted) { isDeleted = deleted; }

    public boolean isPasswordProtected() { return isPasswordProtected; }
    public void setPasswordProtected(boolean passwordProtected) { isPasswordProtected = passwordProtected; }

    public List<String> getImages() { return images != null ? images : new ArrayList<>(); }
    public void setImages(List<String> images) { this.images = images; }

    public String getShareToken() { return shareToken; }
    public void setShareToken(String shareToken) { this.shareToken = shareToken; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public List<Label> getLabels() { return labels != null ? labels : new ArrayList<>(); }
    public void setLabels(List<Label> labels) { this.labels = labels; }

    public boolean isSharedWithMe() { return isSharedWithMe; }
    public void setSharedWithMe(boolean sharedWithMe) { isSharedWithMe = sharedWithMe; }

    public String getSharedPermission() { return sharedPermission != null ? sharedPermission : "viewer"; }
    public void setSharedPermission(String sharedPermission) { this.sharedPermission = sharedPermission; }

    public String getSharedAt() { return sharedAt; }
    public void setSharedAt(String sharedAt) { this.sharedAt = sharedAt; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
