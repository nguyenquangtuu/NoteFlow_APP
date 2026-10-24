package com.noteflow.app.data.local.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import com.noteflow.app.data.local.entity.LabelEntity;

import java.util.List;

@Dao
public interface LabelDao {

    @Query("SELECT * FROM labels ORDER BY name ASC")
    LiveData<List<LabelEntity>> getAllLabels();

    @Query("SELECT * FROM labels ORDER BY name ASC")
    List<LabelEntity> getAllLabelsSync();

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertOrUpdate(LabelEntity label);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertOrUpdateAll(List<LabelEntity> labels);

    @Query("DELETE FROM labels WHERE id = :labelId")
    void deleteById(String labelId);

    @Query("DELETE FROM labels")
    void clearAll();
}
