package com.noteflow.app.data.model.request;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class NoteRequest {
    @SerializedName("title")
    private String title;

    @SerializedName("content")
    private String content;

    @SerializedName("noteDate")
    private String noteDate;

    @SerializedName("isPinned")
    private Boolean isPinned;

    @SerializedName("isDeleted")
    private Boolean isDeleted;

    @SerializedName("labelIds")
    private List<String> labelIds;

    @SerializedName("notePassword")
    private String notePassword;

    @SerializedName("noteAccessPassword")
    private String noteAccessPassword;

    @SerializedName("clearPassword")
    private Boolean clearPassword;

    public NoteRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getNoteDate() { return noteDate; }
    public void setNoteDate(String noteDate) { this.noteDate = noteDate; }

    public Boolean getPinned() { return isPinned; }
    public void setPinned(Boolean pinned) { isPinned = pinned; }

    public Boolean getDeleted() { return isDeleted; }
    public void setDeleted(Boolean deleted) { isDeleted = deleted; }

    public List<String> getLabelIds() { return labelIds; }
    public void setLabelIds(List<String> labelIds) { this.labelIds = labelIds; }

    public String getNotePassword() { return notePassword; }
    public void setNotePassword(String notePassword) { this.notePassword = notePassword; }

    public String getNoteAccessPassword() { return noteAccessPassword; }
    public void setNoteAccessPassword(String noteAccessPassword) { this.noteAccessPassword = noteAccessPassword; }

    public Boolean getClearPassword() { return clearPassword; }
    public void setClearPassword(Boolean clearPassword) { this.clearPassword = clearPassword; }
}
