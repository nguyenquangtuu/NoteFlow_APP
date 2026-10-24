package com.noteflow.app.data.model.response;

import com.google.gson.annotations.SerializedName;
import com.noteflow.app.data.model.Note;

public class NoteDetailResponse extends ApiResponse {
    @SerializedName("note")
    private Note note;

    public Note getNote() { return note; }
    public void setNote(Note note) { this.note = note; }
}
