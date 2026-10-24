# Add project specific ProGuard rules here.
-keep class com.noteflow.app.data.model.** { *; }
-keep class com.noteflow.app.data.local.entity.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn io.socket.**
