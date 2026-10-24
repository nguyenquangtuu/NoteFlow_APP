package com.noteflow.app.data.session;

import android.content.Context;
import android.content.SharedPreferences;

import com.noteflow.app.data.model.User;
import com.noteflow.app.utils.Constants;

public class SessionManager {

    private final SharedPreferences prefs;

    public SessionManager(Context context) {
        this.prefs = context.getSharedPreferences(Constants.PREF_NAME, Context.MODE_PRIVATE);
    }

    public void saveAuth(String token, User user) {
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString(Constants.KEY_TOKEN, token);
        if (user != null) {
            editor.putString(Constants.KEY_USER_ID, user.getId());
            editor.putString(Constants.KEY_USER_NAME, user.getFullName());
            editor.putString(Constants.KEY_USER_EMAIL, user.getEmail());
            editor.putString(Constants.KEY_USER_AVATAR, user.getAvatarUrl());
            editor.putBoolean(Constants.KEY_IS_ACTIVE, user.isActive());
            if (user.getPreferences() != null) {
                if (user.getPreferences().getTheme() != null) {
                    editor.putString(Constants.KEY_THEME, user.getPreferences().getTheme());
                }
                if (user.getPreferences().getDefaultView() != null) {
                    editor.putString(Constants.KEY_VIEW_MODE, user.getPreferences().getDefaultView());
                }
            }
        }
        editor.apply();
    }

    public String getToken() {
        return prefs.getString(Constants.KEY_TOKEN, null);
    }

    public boolean isLoggedIn() {
        return getToken() != null && !getToken().isEmpty();
    }

    public String getUserId() {
        return prefs.getString(Constants.KEY_USER_ID, "");
    }

    public String getUserName() {
        return prefs.getString(Constants.KEY_USER_NAME, "Người dùng");
    }

    public void setUserName(String name) {
        prefs.edit().putString(Constants.KEY_USER_NAME, name).apply();
    }

    public String getUserEmail() {
        return prefs.getString(Constants.KEY_USER_EMAIL, "");
    }

    public String getTheme() {
        return prefs.getString(Constants.KEY_THEME, "light");
    }

    public void setTheme(String theme) {
        prefs.edit().putString(Constants.KEY_THEME, theme).apply();
    }

    public String getViewMode() {
        return prefs.getString(Constants.KEY_VIEW_MODE, "grid");
    }

    public void setViewMode(String viewMode) {
        prefs.edit().putString(Constants.KEY_VIEW_MODE, viewMode).apply();
    }

    public void clear() {
        prefs.edit().clear().apply();
    }
}
