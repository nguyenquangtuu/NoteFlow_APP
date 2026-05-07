"use client";
import { CalendarDays, Pin, Share2, Trash2, MoreHorizontal, X, Plus, Lock } from "lucide-react";
import dayjs from "dayjs";
import { useNoteFlowContext } from "./NoteFlowProvider";
import { api } from "@/lib/api";
import { useState, useEffect, useRef } from "react";

export function NoteEditor() {
  const {
    selectedNote, draft, setDraft, restoreNote, removeNotePermanently,
    togglePin, openShareModal, removeNote, removeLabelFromNote,
    setLabelNameInput, setLabelColorInput, setLabelModal,
    token, labels, setLabels, setSaveMessage, addLabelToNote, isMounted, parseChecklist
  } = useNoteFlowContext();

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'vi-VN'; // Vietnamese

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setDraft((current: any) => {
              if (!current) return current;
              return {
                ...current,
                content: current.content ? current.content + ' ' + finalTranscript : finalTranscript
              };
            });
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [setDraft]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setSaveMessage("Trình duyệt không hỗ trợ nhận diện giọng nói.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!selectedNote) {
    return (
      <div className="editor-column">
        <div className="empty-card">Chọn một ghi chú để xem chi tiết.</div>
      </div>
    );
  }

  return (
    <div className="editor-column">
      <div className="editor-toolbar">
        <div className="editor-date" style={{ position: "relative", opacity: draft?.isDeleted ? 0.7 : 1 }}>
          <CalendarDays size={18} />
          <span>{dayjs(draft?.noteDate).format("DD/MM/YYYY")}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}><path d="m6 9 6 6 6-6"/></svg>
          {!draft?.isDeleted && (
            <input 
              type="date"
              value={draft?.noteDate || ""}
              onChange={(e) => setDraft((current: any) => current ? { ...current, noteDate: e.target.value } : null)}
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
            />
          )}
        </div>
        <div className="toolbar-actions">
          {selectedNote.isDeleted ? (
            <>
              <button onClick={() => restoreNote(selectedNote.id)} title="Khôi phục ghi chú" style={{ color: 'var(--success)', fontWeight: 500 }}>
                Khôi phục
              </button>
              <button onClick={() => removeNotePermanently(selectedNote.id)} title="Xóa vĩnh viễn" style={{ color: 'var(--danger)', fontWeight: 500 }}>
                Xóa vĩnh viễn
              </button>
            </>
          ) : (
            <>
              <button onClick={() => togglePin(selectedNote)} title="Ghim ghi chú">
                <Pin size={18} style={{ fill: selectedNote.isPinned ? "currentColor" : "none" }} />
              </button>
              {!selectedNote.isSharedWithMe && (
                <button onClick={() => openShareModal(selectedNote)} title="Chia sẻ">
                  <Share2 size={18} />
                </button>
              )}
              {!selectedNote.isSharedWithMe && (
                <button onClick={() => removeNote(selectedNote.id)} title="Xóa">
                  <Trash2 size={18} />
                </button>
              )}
              <button>
                <MoreHorizontal size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {draft?.isDeleted && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
          Ghi chú này đang nằm trong thùng rác. Bạn cần khôi phục để có thể chỉnh sửa.
        </div>
      )}

      <div className="title-area" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="text"
          className="title-input"
          value={draft?.title || ""}
          onChange={(event) => setDraft((current: any) => current ? ({ ...current, title: event.target.value }) : null)}
          placeholder="Tiêu đề ghi chú"
          disabled={draft?.isDeleted || (selectedNote.isSharedWithMe && selectedNote.sharedPermission === 'viewer')}
        />
        {selectedNote.isSharedWithMe && selectedNote.sharedPermission === 'viewer' && (
          <span style={{ 
            background: 'var(--panel)', 
            color: 'var(--text-muted)', 
            fontSize: '0.75rem', 
            padding: '4px 8px', 
            borderRadius: 4, 
            border: '1px solid var(--border)',
            whiteSpace: 'nowrap'
          }}>Chỉ xem</span>
        )}
      </div>

      <div className="tag-row">
        {draft?.labels?.map((label: any) => (
          <span className="tag" key={label.id} style={{ background: `${label.color}15`, color: label.color }}>
            {label.name}
            <X size={12} style={{ marginLeft: 4, cursor: "pointer" }} onClick={() => removeLabelFromNote(label.id)} />
          </span>
        ))}
        <div className="add-tag-container" style={{ position: "relative" }}>
          <span className="add-tag" onClick={() => {
            if (draft?.isDeleted) return;
            setLabelNameInput("");
            setLabelColorInput("#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
            setLabelModal({
              isOpen: true,
              title: "Thêm nhãn cho ghi chú",
              initialName: "",
              initialColor: "#4F46E5",
              onConfirm: async (labelName: string, color: string) => {
                if (!labelName.trim()) return;
                const existing = labels.find((l: any) => l.name.toLowerCase() === labelName.trim().toLowerCase());
                if (existing) {
                  addLabelToNote(existing);
                } else {
                  const randomColor = color || ("#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
                  if (token) {
                    try {
                      const response = await api.createLabel(token, { name: labelName.trim(), color: randomColor });
                      setLabels((prev: any) => [...prev, response.label]);
                      addLabelToNote(response.label);
                    } catch (err) {
                      setSaveMessage("Không thể tạo nhãn mới trên server.");
                    }
                  } else {
                    const newLabel: any = { id: crypto.randomUUID(), name: labelName.trim(), color: randomColor };
                    setLabels((prev: any) => [...prev, newLabel]);
                    addLabelToNote(newLabel);
                  }
                }
                setLabelModal((prev: any) => ({ ...prev, isOpen: false }));
              }
            });
          }}>
            <Plus size={16} /> Thêm nhãn
          </span>
        </div>
        {draft?.isPasswordProtected ? (
          <span className="tag" style={{ background: "#F1F5F9", color: "#64748B" }}>
            <Lock size={12} style={{ marginRight: 4 }} />
            Bảo vệ
          </span>
        ) : null}
      </div>

      <div className="rich-content">
        <textarea
          className="content-input"
          value={draft?.content || ""}
          onChange={(event) => setDraft((current: any) => current ? ({ ...current, content: event.target.value }) : null)}
          placeholder="Bắt đầu viết ghi chú của bạn..."
          readOnly={draft?.isDeleted || (selectedNote.isSharedWithMe && selectedNote.sharedPermission === 'viewer')}
        />
        
        {draft && parseChecklist(draft.content).length ? (
          <div className="checklist-preview">
            <div className="checklist-items">
              {parseChecklist(draft.content).map((item: any, index: number) => (
                <label key={`${item.text}-${index}`} className="checklist-item">
                  <input type="checkbox" checked={item.checked} readOnly />
                  <span>{item.text}</span>
                </label>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <footer className="editor-footer">
        <span>Cập nhật {isMounted ? dayjs(draft?.updatedAt || new Date()).format("HH:mm") : "--:--"}</span>
        <span>{draft?.content?.split(/\\s+/)?.filter((w: string) => w.length > 0)?.length || 0} từ</span>
      </footer>
    </div>
  );
}