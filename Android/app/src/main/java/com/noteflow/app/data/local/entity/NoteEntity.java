package com.noteflow.app.data.local.entity;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import com.noteflow.app.data.model.Label;
import com.noteflow.app.data.model.Note;

import java.util.ArrayList;
import java.util.List;

@Entity(tableName = "notes")
public class NoteEntity {

    @PrimaryKey
    @NonNull
    private String id;
    private String title;
    private String content;
    private String noteDate;
    private boolean isPinned;
    private String pinnedAt;
    private boolean isDeleted;
    private boolean isPasswordProtected;
    private List<String> images = new ArrayList<>();
    private String shareToken;
    private String updatedBy;
    private List<Label> labels = new ArrayList<>();
    private boolean isSharedWithMe;
    private String sharedPermission;
    private String sharedAt;
    private String ownerName;
    private String ownerEmail;
    private String createdAt;
    private String updatedAt;

    public NoteEntity() {}

    public static NoteEntity fromNote(Note note) {
        NoteEntity entity = new NoteEntity();
        entity.setId(note.getId());
        entity.setTitle(note.getTitle());
        entity.setContent(note.getContent());
        entity.setNoteDate(note.getNoteDate());
        entity.setPinned(note.isPinned());
        entity.setPinnedAt(note.getPinnedAt());
        entity.setDeleted(note.isDeleted());
        entity.setPasswordProtected(note.isPasswordProtected());
        entity.setImages(note.getImages());
        entity.setShareToken(note.getShareToken());
        entity.setUpdatedBy(note.getUpdatedBy());
        entity.setLabels(note.getLabels());
        entity.setSharedWithMe(note.isSharedWithMe());
        entity.setSharedPermission(note.getSharedPermission());
        entity.setSharedAt(note.getSharedAt());
        entity.setOwnerName(note.getOwnerName());
        entity.setOwnerEmail(note.getOwnerEmail());
        entity.setCreatedAt(note.getCreatedAt());
        entity.setUpdatedAt(note.getUpdatedAt());
        return entity;
    }

    public Note toNote() {
        Note note = new Note();
        note.setId(id);
        note.setTitle(title);
        note.setContent(content);
        note.setNoteDate(noteDate);
        note.setPinned(isPinned);
        note.setPinnedAt(pinnedAt);
        note.setDeleted(isDeleted);
        note.setPasswordProtected(isPasswordProtected);
        note.setImages(images);
        note.setShareToken(shareToken);
        note.setUpdatedBy(updatedBy);
        note.setLabels(labels);
        note.setSharedWithMe(isSharedWithMe);
        note.setSharedPermission(sharedPermission);
        note.setSharedAt(sharedAt);
        note.setOwnerName(ownerName);
        note.setOwnerEmail(ownerEmail);
        note.setCreatedAt(createdAt);
        note.setUpdatedAt(updatedAt);
        return note;
    }

    @NonNull
    public String getId() { return id; }
    public void setId(@NonNull String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
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

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public String getShareToken() { return shareToken; }
    public void setShareToken(String shareToken) { this.shareToken = shareToken; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public List<Label> getLabels() { return labels; }
    public void setLabels(List<Label> labels) { this.labels = labels; }

    public boolean isSharedWithMe() { return isSharedWithMe; }
    public void setSharedWithMe(boolean sharedWithMe) { isSharedWithMe = sharedWithMe; }

    public String getSharedPermission() { return sharedPermission; }
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
