package com.noteflow.app.data.local.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import com.noteflow.app.data.local.entity.NoteEntity;

import java.util.List;

@Dao
public interface NoteDao {

    @Query("SELECT * FROM notes WHERE isDeleted = 0 ORDER BY isPinned DESC, noteDate DESC, updatedAt DESC")
    LiveData<List<NoteEntity>> getAllActiveNotes();

    @Query("SELECT * FROM notes WHERE isDeleted = 0 ORDER BY isPinned DESC, noteDate DESC, updatedAt DESC")
    List<NoteEntity> getAllActiveNotesSync();

    @Query("SELECT * FROM notes WHERE isDeleted = 1 ORDER BY updatedAt DESC")
    LiveData<List<NoteEntity>> getTrashNotes();

    @Query("SELECT * FROM notes WHERE id = :noteId LIMIT 1")
    NoteEntity getNoteById(String noteId);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertOrUpdate(NoteEntity note);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertOrUpdateAll(List<NoteEntity> notes);

    @Query("DELETE FROM notes WHERE id = :noteId")
    void deleteById(String noteId);

    @Query("DELETE FROM notes")
    void clearAll();
}
