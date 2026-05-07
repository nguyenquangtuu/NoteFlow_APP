"use client";
import { CalendarDays, Pin } from "lucide-react";
import dayjs from "dayjs";
import { useNoteFlowContext } from "./NoteFlowProvider";

export function NoteList() {
  const {
    listTitle, visibleNotes, sortOrder, setSortOrder, isPending,
    selectedNoteId, selectNote, viewMode
  } = useNoteFlowContext();

  return (
    <div className="note-column">


      <div className="column-head">
        <div>
          <h2>{listTitle}</h2>
          <p>{visibleNotes.length} ghi chú hiện có</p>
        </div>
        <span style={{ userSelect: "none", cursor: "pointer" }} onClick={() => !isPending && setSortOrder((prev: any) => prev === "newest" ? "oldest" : "newest")}>
          {isPending ? "Đang đồng bộ..." : sortOrder === "newest" ? "Mới nhất" : "Cũ nhất"}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: sortOrder === "oldest" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="m6 9 6 6 6-6"/></svg>
        </span>
      </div>

      <div className={`notes-list ${viewMode}`}>
        {visibleNotes.map((note: any) => (
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
            <div className="note-card-meta">
              <CalendarDays size={14} />
              <span>{dayjs(note.noteDate).format("DD/MM/YYYY")}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}