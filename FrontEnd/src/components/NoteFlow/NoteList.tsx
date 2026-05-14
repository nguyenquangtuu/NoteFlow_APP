"use client";
<<<<<<< HEAD
import { CalendarDays, Pin, Share2, Lock } from "lucide-react";
=======
import { CalendarDays, Pin } from "lucide-react";
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
import dayjs from "dayjs";
import { useNoteFlowContext } from "./NoteFlowProvider";

export function NoteList() {
<<<<<<< HEAD
  const { listTitle, visibleNotes, sortOrder, setSortOrder, isPending, selectedNoteId, selectNote, viewMode } = useNoteFlowContext();

  return (
    <div className="note-column">
=======
  const {
    listTitle, visibleNotes, sortOrder, setSortOrder, isPending,
    selectedNoteId, selectNote, viewMode
  } = useNoteFlowContext();

  return (
    <div className="note-column">


>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
      <div className="column-head">
        <div>
          <h2>{listTitle}</h2>
          <p>{visibleNotes.length} ghi chú hiện có</p>
        </div>
<<<<<<< HEAD
        <span style={{ userSelect: "none", cursor: "pointer" }} onClick={() => !isPending && setSortOrder((prev: any) => (prev === "newest" ? "oldest" : "newest"))}>
          {isPending ? "Đang đồng bộ..." : sortOrder === "newest" ? "Mới nhất" : "Cũ nhất"}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: sortOrder === "oldest" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <path d="m6 9 6 6 6-6" />
          </svg>
=======
        <span style={{ userSelect: "none", cursor: "pointer" }} onClick={() => !isPending && setSortOrder((prev: any) => prev === "newest" ? "oldest" : "newest")}>
          {isPending ? "Đang đồng bộ..." : sortOrder === "newest" ? "Mới nhất" : "Cũ nhất"}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: sortOrder === "oldest" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="m6 9 6 6 6-6"/></svg>
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
        </span>
      </div>

      <div className={`notes-list ${viewMode}`}>
        {visibleNotes.map((note: any) => (
<<<<<<< HEAD
          <article key={note.id} className={`note-card ${selectedNoteId === note.id ? "selected" : ""}`} onClick={() => selectNote(note)}>
            <div className="note-card-head">
              <h3>{note.title}</h3>
              <div style={{ display: "flex", gap: 6, alignItems: "center", color: "var(--text-muted)" }}>
                {note.isSharedWithMe && <Share2 size={14} />}
                {note.isPasswordProtected && <Lock size={14} />}
                {note.isPinned && <Pin size={16} className="pin-icon" />}
              </div>
            </div>
            <p>{note.content.slice(0, 100)}{note.content.length > 100 ? "..." : ""}</p>
            {note.isSharedWithMe ? (
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "6px" }}>
                Chia sẻ bởi {note.ownerName || note.ownerEmail || "Người dùng"}
                {note.sharedAt ? ` • ${dayjs(note.sharedAt).format("DD/MM/YYYY HH:mm")}` : ""}
              </p>
            ) : null}
=======
          <article
            key={note.id}
            className={`note-card ${selectedNoteId === note.id ? "selected" : ""}`}
            onClick={() => selectNote(note)}
          >
            <div className="note-card-head">
              <h3>{note.title}</h3>
              {note.isPinned && <Pin size={16} className="pin-icon" />}
            </div>
            <p>{note.content.slice(0, 100)}{note.content.length > 100 ? "..." : ""}</p>
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
            <div className="note-card-meta">
              <CalendarDays size={14} />
              <span>{dayjs(note.noteDate).format("DD/MM/YYYY")}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
