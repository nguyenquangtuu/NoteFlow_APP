package com.noteflow.app.data.local.entity;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import com.noteflow.app.data.model.Label;

@Entity(tableName = "labels")
public class LabelEntity {

    @PrimaryKey
    @NonNull
    private String id;
    private String name;
    private String color;
    private int noteCount;

    public LabelEntity() {}

    public static LabelEntity fromLabel(Label label) {
        LabelEntity entity = new LabelEntity();
        entity.setId(label.getId());
        entity.setName(label.getName());
        entity.setColor(label.getColor());
        entity.setNoteCount(label.getNoteCount());
        return entity;
    }

    public Label toLabel() {
        Label label = new Label(id, name, color);
        label.setNoteCount(noteCount);
        return label;
    }

    @NonNull
    public String getId() { return id; }
    public void setId(@NonNull String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public int getNoteCount() { return noteCount; }
    public void setNoteCount(int noteCount) { this.noteCount = noteCount; }
}
