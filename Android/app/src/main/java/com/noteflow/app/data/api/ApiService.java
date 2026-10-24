package com.noteflow.app.data.api;

import com.noteflow.app.data.model.request.LoginRequest;
import com.noteflow.app.data.model.request.NoteRequest;
import com.noteflow.app.data.model.request.RegisterRequest;
import com.noteflow.app.data.model.response.ApiResponse;
import com.noteflow.app.data.model.response.AuthResponse;
import com.noteflow.app.data.model.response.ImageUploadResponse;
import com.noteflow.app.data.model.response.LabelDetailResponse;
import com.noteflow.app.data.model.response.LabelListResponse;
import com.noteflow.app.data.model.response.NoteDetailResponse;
import com.noteflow.app.data.model.response.NoteListResponse;
import com.noteflow.app.data.model.response.ShareLinkResponse;
import com.noteflow.app.data.model.response.SharesResponse;
import com.noteflow.app.data.model.response.UserResponse;

import java.util.Map;
import okhttp3.MultipartBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.HTTP;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiService {

    // ==========================================
    // AUTHENTICATION
    // ==========================================
    @POST("auth/register")
    Call<AuthResponse> register(@Body RegisterRequest request);

    @POST("auth/login")
    Call<AuthResponse> login(@Body LoginRequest request);

    @POST("auth/activate")
    Call<ApiResponse> activate(@Body Map<String, String> body);

    @POST("auth/forgot-password")
    Call<ApiResponse> forgotPassword(@Body Map<String, String> body);

    @POST("auth/reset-password")
    Call<ApiResponse> resetPassword(@Body Map<String, String> body);

    @GET("auth/me")
    Call<UserResponse> getCurrentUser();

    @POST("auth/change-password")
    Call<ApiResponse> changePassword(@Body Map<String, String> body);

    // ==========================================
    // USERS & PROFILE
    // ==========================================
    @GET("users/profile")
    Call<UserResponse> getProfile();

    @PUT("users/profile")
    Call<UserResponse> updateProfile(@Body Map<String, Object> body);

    // ==========================================
    // LABELS
    // ==========================================
    @GET("labels")
    Call<LabelListResponse> getLabels();

    @POST("labels")
    Call<LabelDetailResponse> createLabel(@Body Map<String, String> body);

    @PUT("labels/{id}")
    Call<ApiResponse> updateLabel(@Path("id") String id, @Body Map<String, String> body);

    @DELETE("labels/{id}")
    Call<ApiResponse> deleteLabel(@Path("id") String id);

    // ==========================================
    // NOTES (CRUD & FILTERS)
    // ==========================================
    @GET("notes")
    Call<NoteListResponse> getNotes(
            @Query("date") String date,
            @Query("search") String search,
            @Query("labelId") String labelId,
            @Query("includeDeleted") Object includeDeleted, // 0, 1, or "all"
            @Query("sharedWithMe") Integer sharedWithMe,
            @Query("includeShared") Integer includeShared
    );

    @POST("notes")
    Call<NoteDetailResponse> createNote(@Body NoteRequest request);

    @PUT("notes/{id}")
    Call<NoteDetailResponse> updateNote(@Path("id") String id, @Body NoteRequest request);

    @HTTP(method = "DELETE", path = "notes/{id}", hasBody = true)
    Call<ApiResponse> deleteNote(@Path("id") String id, @Body Map<String, String> body);

    @HTTP(method = "DELETE", path = "notes/{id}/permanent", hasBody = true)
    Call<ApiResponse> deleteNotePermanently(@Path("id") String id, @Body Map<String, String> body);

    // ==========================================
    // NOTE PASSWORD LOCK
    // ==========================================
    @POST("notes/{id}/password/verify")
    Call<NoteDetailResponse> verifyNotePassword(@Path("id") String id, @Body Map<String, String> body);

    @POST("notes/{id}/password/enable")
    Call<NoteDetailResponse> enableNotePassword(@Path("id") String id, @Body Map<String, String> body);

    @PUT("notes/{id}/password")
    Call<NoteDetailResponse> changeNotePassword(@Path("id") String id, @Body Map<String, String> body);

    @POST("notes/{id}/password/disable")
    Call<NoteDetailResponse> disableNotePassword(@Path("id") String id, @Body Map<String, String> body);

    // ==========================================
    // NOTE IMAGES
    // ==========================================
    @Multipart
    @POST("notes/{id}/images")
    Call<ImageUploadResponse> uploadNoteImage(
            @Path("id") String id,
            @Part MultipartBody.Part image
    );

    // ==========================================
    // NOTE SHARING & COLLABORATION
    // ==========================================
    @POST("notes/{id}/share")
    Call<ShareLinkResponse> generateShareLink(@Path("id") String id);

    @GET("notes/{id}/shares")
    Call<SharesResponse> getNoteShares(@Path("id") String id);

    @PUT("notes/{id}/shares/public")
    Call<ApiResponse> updatePublicPermission(@Path("id") String id, @Body Map<String, String> body);

    @POST("notes/{id}/shares/user")
    Call<ApiResponse> addShareUser(@Path("id") String id, @Body Map<String, String> body);

    @DELETE("notes/{id}/shares/user/{email}")
    Call<ApiResponse> removeShareUser(@Path("id") String id, @Path("email") String email);

    @GET("notes/shared/{token}")
    Call<NoteDetailResponse> getSharedNote(@Path("token") String token);

    @PUT("notes/shared/{token}")
    Call<ApiResponse> updateSharedNote(@Path("token") String token, @Body Map<String, String> body);
}
