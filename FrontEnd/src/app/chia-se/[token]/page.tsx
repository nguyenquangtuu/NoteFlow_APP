"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { StickyNote, Save } from "lucide-react";
import { io } from "socket.io-client";
import type { Note } from "@/types";

export default function SharedNotePage() {
  const params = useParams();
  const token = params.token as string;
  const [note, setNote] = useState<Note | null>(null);
  const [permission, setPermission] = useState<string>("viewer");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!token) return;

    async function fetchSharedNote() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/notes/shared/${token}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Không thể tải ghi chú");
        }
        setNote(data.note);
        setPermission(data.permission || data.note.sharedPermission || "viewer");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSharedNote();
  }, [token]);

  const handleSave = async (updatedNote: Note) => {

    setSaveStatus("Đang lưu...");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/notes/shared/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updatedNote.title,
          content: updatedNote.content
        })
      });
      if (!res.ok) throw new Error("Lỗi khi lưu");
      setSaveStatus("Đã lưu");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (err) {
      setSaveStatus("Lỗi lưu");
    }
  };

  const handleChange = (field: "title" | "content", value: string) => {
    if (!note || permission !== "editor") return;
    const updated = { ...note, [field]: value };
    setNote(updated);

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      handleSave(updated);
    }, 1000);
  };

  useEffect(() => {
    if (!note?.id) return;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
      : "http://localhost:4000";

    const socket = io(socketUrl, {
      withCredentials: true,
    });

    socket.on("note_updated", (data: { note: Note; updatedBy: string }) => {
      if (data.note?.id !== note.id) return;
      setNote((current) => {
        if (!current) return current;
        return {
          ...current,
          ...data.note,
        };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [note?.id, token]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--bg)', color: 'var(--text-muted)' }}>
        Đang tải ghi chú...
      </div>
    );
  }

  if (error || !note) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--bg)' }}>
        <div style={{ background: 'var(--panel)', padding: '2rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', maxWidth: 400, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ color: '#EF4444', marginBottom: 16 }}>Lỗi truy cập</h2>
          <p style={{ color: 'var(--text-muted)' }}>{error || "Ghi chú không tồn tại hoặc đã bị gỡ."}</p>
        </div>
      </div>
    );
  }

  const isEditor = permission === "editor";
  const authToken = typeof window !== "undefined" ? localStorage.getItem("noteflow_token") : null;

  const handleJoinWorkspace = async () => {
    if (!authToken) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/notes/shared/${token}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok && data.noteId) {
        window.location.href = `/?noteId=${data.noteId}`;
      } else {
        alert(data.message || "Không thể lưu vào Workspace.");
      }
    } catch (e) {
      alert("Đã xảy ra lỗi.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        padding: '16px 32px', 
        borderBottom: '1px solid var(--border)', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--panel)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="app-icon" style={{ width: 32, height: 32, background: 'var(--accent-soft)' }}>
            <StickyNote size={18} />
          </div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: 'var(--text)' }}>NoteFlow</h1>
          <span style={{ padding: '4px 8px', background: 'var(--bg)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            {isEditor ? 'Chế độ chỉnh sửa' : 'Chế độ chỉ xem'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {saveStatus && (
            <span className="save-status" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save size={14} /> {saveStatus}
            </span>
          )}
          {authToken && (
            <button 
              onClick={handleJoinWorkspace}
              style={{
                padding: '8px 16px',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              Lưu vào Workspace
            </button>
          )}
        </div>
      </header>
      
      <main style={{ flex: 1, padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <article className="editor-column" style={{ 
          width: '100%', 
          maxWidth: 800, 
          height: 'calc(100vh - 140px)',
          margin: '0 auto'
        }}>
          <div className="editor-toolbar" style={{ marginBottom: 16, paddingBottom: 16 }}>
            <div className="editor-date">
              <span>{note.noteDate}</span>
            </div>
          </div>

          <div className="title-area">
            <input
              type="text"
              className="title-input"
              value={note.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Tiêu đề ghi chú"
              readOnly={!isEditor}
            />
          </div>
          
          <div className="rich-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <textarea
              className="content-input"
              value={note.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Nội dung ghi chú..."
              readOnly={!isEditor}
              style={{ flex: 1, height: '100%' }}
            />
          </div>

          {note.images && note.images.length > 0 && (
            <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {note.images.map((img, index) => (
                <img 
                  key={index} 
                  src={`${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : "http://localhost:4000"}${img}`} 
                  alt={`Image ${index + 1}`} 
                  style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', maxHeight: 400, objectFit: 'contain' }}
                />
              ))}
            </div>
          )}
        </article>
      </main>
    </div>
  );
}

