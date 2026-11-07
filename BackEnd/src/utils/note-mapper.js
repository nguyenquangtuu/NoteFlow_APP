function parseJsonSafe(val, fallback) {
  if (!val) return fallback;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return val;
}

function mapNote(row) {
  const labels = parseJsonSafe(row.labels, []);
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    noteDate: row.note_date,
    isPinned: Boolean(row.is_pinned),
    pinnedAt: row.pinned_at || null,
    isDeleted: Boolean(row.is_deleted),
    isPasswordProtected: Boolean(row.is_password_protected),
    images: parseJsonSafe(row.images, []),
    shareToken: row.share_token,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    labels: Array.isArray(labels) ? labels.filter(Boolean) : [],
  };
}

module.exports = {
  mapNote,
};
