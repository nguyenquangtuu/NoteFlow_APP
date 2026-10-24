package com.noteflow.app.data.model.response;

import com.google.gson.annotations.SerializedName;
import com.noteflow.app.data.model.Note;
import java.util.ArrayList;
import java.util.List;

public class NoteListResponse extends ApiResponse {
    @SerializedName("notes")
    private List<Note> notes = new ArrayList<>();

    public List<Note> getNotes() { return notes != null ? notes : new ArrayList<>(); }
    public void setNotes(List<Note> notes) { this.notes = notes; }
}
