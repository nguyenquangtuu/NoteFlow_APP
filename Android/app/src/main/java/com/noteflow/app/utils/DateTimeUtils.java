package com.noteflow.app.utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class DateTimeUtils {

    private static final SimpleDateFormat API_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
    private static final SimpleDateFormat DISPLAY_DATE_FORMAT = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
    private static final SimpleDateFormat DISPLAY_DATETIME_FORMAT = new SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault());

    public static String getTodayApiDate() {
        return API_DATE_FORMAT.format(new Date());
    }

    public static String formatDisplayDate(String apiDate) {
        if (apiDate == null || apiDate.isEmpty()) return "";
        try {
            Date date = API_DATE_FORMAT.parse(apiDate);
            if (date != null) {
                return DISPLAY_DATE_FORMAT.format(date);
            }
        } catch (Exception ignored) {}
        return apiDate;
    }

    public static String formatDisplayDateTime(String isoString) {
        if (isoString == null || isoString.isEmpty()) return "";
        try {
            // ISO format or SQL datetime
            String clean = isoString.replace("T", " ").replace("Z", "");
            if (clean.length() > 19) clean = clean.substring(0, 19);
            SimpleDateFormat parser = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
            Date date = parser.parse(clean);
            if (date != null) {
                return DISPLAY_DATETIME_FORMAT.format(date);
            }
        } catch (Exception ignored) {}
        return isoString;
    }
}
