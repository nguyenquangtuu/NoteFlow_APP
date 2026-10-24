package com.noteflow.app.data.model;

import com.google.gson.annotations.SerializedName;
import java.io.Serializable;
import java.util.Objects;

public class Label implements Serializable {
    @SerializedName("id")
    private String id;

    @SerializedName("name")
    private String name;

    @SerializedName("color")
    private String color;

    @SerializedName("noteCount")
    private int noteCount;

    public Label() {}

    public Label(String id, String name, String color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getColor() { return color != null ? color : "#4F46E5"; }
    public void setColor(String color) { this.color = color; }

    public int getNoteCount() { return noteCount; }
    public void setNoteCount(int noteCount) { this.noteCount = noteCount; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Label label = (Label) o;
        return Objects.equals(id, label.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
