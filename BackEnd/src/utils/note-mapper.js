<<<<<<< HEAD
﻿function mapNote(row) {
=======
function mapNote(row) {
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    noteDate: row.note_date,
    isPinned: Boolean(row.is_pinned),
<<<<<<< HEAD
    pinnedAt: row.pinned_at || null,
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
    isDeleted: Boolean(row.is_deleted),
    isPasswordProtected: Boolean(row.is_password_protected),
    images: row.images ? JSON.parse(row.images) : [],
    shareToken: row.share_token,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    labels: row.labels ? JSON.parse(row.labels) : [],
  };
}

module.exports = {
  mapNote,
};
