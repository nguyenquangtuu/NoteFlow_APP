package com.noteflow.app.data.model;

import com.google.gson.annotations.SerializedName;
import java.io.Serializable;

public class Preferences implements Serializable {
    @SerializedName("theme")
    private String theme;

    @SerializedName("defaultView")
    private String defaultView;

    @SerializedName("language")
    private String language;

    @SerializedName("fontSize")
    private String fontSize;

    @SerializedName("noteColor")
    private String noteColor;

    public Preferences() {}

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public String getDefaultView() { return defaultView; }
    public void setDefaultView(String defaultView) { this.defaultView = defaultView; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getFontSize() { return fontSize; }
    public void setFontSize(String fontSize) { this.fontSize = fontSize; }

    public String getNoteColor() { return noteColor; }
    public void setNoteColor(String noteColor) { this.noteColor = noteColor; }
}
