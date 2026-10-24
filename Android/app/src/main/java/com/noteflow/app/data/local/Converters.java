package com.noteflow.app.data.local;

import androidx.room.TypeConverter;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.noteflow.app.data.model.Label;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class Converters {

    private static final Gson gson = new Gson();

    @TypeConverter
    public static String fromStringList(List<String> list) {
        if (list == null) return "[]";
        return gson.toJson(list);
    }

    @TypeConverter
    public static List<String> toStringList(String value) {
        if (value == null || value.isEmpty()) return new ArrayList<>();
        Type listType = new TypeToken<List<String>>() {}.getType();
        return gson.fromJson(value, listType);
    }

    @TypeConverter
    public static String fromLabelList(List<Label> labels) {
        if (labels == null) return "[]";
        return gson.toJson(labels);
    }

    @TypeConverter
    public static List<Label> toLabelList(String value) {
        if (value == null || value.isEmpty()) return new ArrayList<>();
        Type listType = new TypeToken<List<Label>>() {}.getType();
        return gson.fromJson(value, listType);
    }
}
