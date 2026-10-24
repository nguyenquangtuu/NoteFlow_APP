package com.noteflow.app.data.repository;

import android.content.Context;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.Transformations;

import com.noteflow.app.data.api.ApiService;
import com.noteflow.app.data.api.RetrofitClient;
import com.noteflow.app.data.local.AppDatabase;
import com.noteflow.app.data.local.dao.LabelDao;
import com.noteflow.app.data.local.entity.LabelEntity;
import com.noteflow.app.data.model.Label;
import com.noteflow.app.data.model.response.ApiResponse;
import com.noteflow.app.data.model.response.LabelDetailResponse;
import com.noteflow.app.data.model.response.LabelListResponse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LabelRepository {

    private final ApiService apiService;
    private final LabelDao labelDao;
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    public LabelRepository(Context context) {
        this.apiService = RetrofitClient.getInstance();
        this.labelDao = AppDatabase.getInstance(context).labelDao();
    }

    public LiveData<List<Label>> getLocalLabels() {
        return Transformations.map(labelDao.getAllLabels(), entities -> {
            List<Label> labels = new ArrayList<>();
            if (entities != null) {
                for (LabelEntity entity : entities) {
                    labels.add(entity.toLabel());
                }
            }
            return labels;
        });
    }

    public void fetchLabels(Callback<LabelListResponse> callback) {
        apiService.getLabels().enqueue(new Callback<LabelListResponse>() {
            @Override
            public void onResponse(Call<LabelListResponse> call, Response<LabelListResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    executorService.execute(() -> {
                        List<LabelEntity> entities = new ArrayList<>();
                        for (Label l : response.body().getLabels()) {
                            entities.add(LabelEntity.fromLabel(l));
                        }
                        labelDao.clearAll();
                        labelDao.insertOrUpdateAll(entities);
                    });
                }
                if (callback != null) callback.onResponse(call, response);
            }

            @Override
            public void onFailure(Call<LabelListResponse> call, Throwable t) {
                if (callback != null) callback.onFailure(call, t);
            }
        });
    }

    public void createLabel(String name, String color, Callback<LabelDetailResponse> callback) {
        Map<String, String> body = new HashMap<>();
        body.put("name", name);
        body.put("color", color);
        apiService.createLabel(body).enqueue(new Callback<LabelDetailResponse>() {
            @Override
            public void onResponse(Call<LabelDetailResponse> call, Response<LabelDetailResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getLabel() != null) {
                    executorService.execute(() -> labelDao.insertOrUpdate(LabelEntity.fromLabel(response.body().getLabel())));
                }
                if (callback != null) callback.onResponse(call, response);
            }

            @Override
            public void onFailure(Call<LabelDetailResponse> call, Throwable t) {
                if (callback != null) callback.onFailure(call, t);
            }
        });
    }

    public void updateLabel(String id, String name, String color, Callback<ApiResponse> callback) {
        Map<String, String> body = new HashMap<>();
        body.put("name", name);
        body.put("color", color);
        apiService.updateLabel(id, body).enqueue(new Callback<ApiResponse>() {
            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                if (response.isSuccessful()) {
                    executorService.execute(() -> labelDao.insertOrUpdate(new LabelEntity() {{
                        setId(id);
                        setName(name);
                        setColor(color);
                    }}));
                }
                if (callback != null) callback.onResponse(call, response);
            }

            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                if (callback != null) callback.onFailure(call, t);
            }
        });
    }

    public void deleteLabel(String id, Callback<ApiResponse> callback) {
        apiService.deleteLabel(id).enqueue(new Callback<ApiResponse>() {
            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                if (response.isSuccessful()) {
                    executorService.execute(() -> labelDao.deleteById(id));
                }
                if (callback != null) callback.onResponse(call, response);
            }

            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                if (callback != null) callback.onFailure(call, t);
            }
        });
    }
}
