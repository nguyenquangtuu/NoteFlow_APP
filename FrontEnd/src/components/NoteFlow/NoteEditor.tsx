"use client";
<<<<<<< HEAD
import { CalendarDays, Pin, Share2, Trash2, MoreHorizontal, X, Plus, Lock, ImagePlus, ShieldCheck, Eye } from "lucide-react";
=======
import { CalendarDays, Pin, Share2, Trash2, MoreHorizontal, X, Plus, Lock } from "lucide-react";
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
import dayjs from "dayjs";
import { useNoteFlowContext } from "./NoteFlowProvider";
import { api } from "@/lib/api";
import { useState, useEffect, useRef } from "react";

export function NoteEditor() {
  const {
<<<<<<< HEAD
    selectedNote,
    draft,
    setDraft,
    restoreNote,
    removeNotePermanently,
    togglePin,
    openShareModal,
    removeNote,
    removeLabelFromNote,
    setLabelNameInput,
    setLabelColorInput,
    setLabelModal,
    token,
    labels,
    setLabels,
    setNotes,
    setSaveMessage,
    addLabelToNote,
    isMounted,
    parseChecklist,
  } = useNoteFlowContext();

  const [isRecording, setIsRecording] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(true);
  
  const [passwordModal, setPasswordModal] = useState<{
    isOpen: boolean;
    mode: "enable" | "change" | "disable";
  }>({ isOpen: false, mode: "enable" });
  const [passForm, setPassForm] = useState({ current: "", new: "", confirm: "" });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedNote) return;
    setIsUnlocked(!selectedNote.isPasswordProtected);
    setUnlockPassword("");
    setUnlockError("");
  }, [selectedNote?.id]);
=======
    selectedNote, draft, setDraft, restoreNote, removeNotePermanently,
    togglePin, openShareModal, removeNote, removeLabelFromNote,
    setLabelNameInput, setLabelColorInput, setLabelModal,
    token, labels, setLabels, setSaveMessage, addLabelToNote, isMounted, parseChecklist
  } = useNoteFlowContext();

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
<<<<<<< HEAD
        recognition.lang = "vi-VN";

        recognition.onresult = (event: any) => {
          let finalTranscript = "";
=======
        recognition.lang = 'vi-VN'; // Vietnamese

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
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
<<<<<<< HEAD
                content: current.content ? current.content + " " + finalTranscript : finalTranscript,
=======
                content: current.content ? current.content + ' ' + finalTranscript : finalTranscript
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
              };
            });
          }
        };

<<<<<<< HEAD
        recognition.onerror = (_event: any) => {
=======
        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
<<<<<<< HEAD

=======
    
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
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
<<<<<<< HEAD
      } catch (_e) {
        setIsRecording(false);
=======
      } catch (e) {
        console.error(e);
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
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

<<<<<<< HEAD
  const isViewerShared = selectedNote.isSharedWithMe && selectedNote.sharedPermission === "viewer";
  const blockedByPassword = selectedNote.isPasswordProtected && !isUnlocked;
  const isReadOnly = !!draft?.isDeleted || isViewerShared || blockedByPassword;

  const handleUnlock = async () => {
    if (!selectedNote?.isPasswordProtected) {
      setIsUnlocked(true);
      return;
    }
    if (!token) {
      setUnlockError("Cần đăng nhập để mở khóa ghi chú.");
      return;
    }

    try {
      const response = await api.verifyNotePassword(token, selectedNote.id, unlockPassword);
      setDraft(response.note);
      setIsUnlocked(true);
      setUnlockError("");
      setSaveMessage("Mở khóa ghi chú thành công.");
    } catch (error) {
      setUnlockError(error instanceof Error ? error.message : "Không thể mở khóa ghi chú.");
    }
  };

  const handleRemoveImage = (imgToRemove: string) => {
    if (!draft || !draft.images) return;
    const newImages = draft.images.filter(img => img !== imgToRemove);
    setDraft({ ...draft, images: newImages });
    setSaveMessage("Đã xóa ảnh khỏi ghi chú.");
  };

  const handleUploadImage = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file || !token || !selectedNote) return;

    try {
      const response = await api.uploadNoteImage(token, selectedNote.id, file);
      setDraft((current: any) => (current ? { ...current, images: response.images } : current));
      setSaveMessage("Đã tải ảnh lên ghi chú.");
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "Không thể tải ảnh lên.");
    } finally {
      event.target.value = "";
    }
  };

  const handleEnablePassword = async () => {
    if (!token || !selectedNote) return;
    if (!passForm.new || !passForm.confirm) {
      setSaveMessage("Vui lòng nhập đầy đủ mật khẩu.");
      return;
    }
    if (passForm.new !== passForm.confirm) {
      setSaveMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await api.enableNotePassword(token, selectedNote.id, passForm.new, passForm.confirm);
      setDraft(response.note);
      setNotes((prev: any) => prev.map((n: any) => n.id === selectedNote.id ? response.note : n));
      setIsUnlocked(true);
      setSaveMessage(response.message);
      setPasswordModal({ ...passwordModal, isOpen: false });
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "Không thể bật mật khẩu ghi chú.");
    }
  };

  const handleChangePassword = async () => {
    if (!token || !selectedNote) return;
    if (!passForm.current || !passForm.new || !passForm.confirm) {
      setSaveMessage("Vui lòng nhập đầy đủ mật khẩu.");
      return;
    }
    if (passForm.new !== passForm.confirm) {
      setSaveMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await api.changeNotePassword(token, selectedNote.id, passForm.current, passForm.new, passForm.confirm);
      setDraft(response.note);
      setNotes((prev: any) => prev.map((n: any) => n.id === selectedNote.id ? response.note : n));
      setSaveMessage(response.message);
      setPasswordModal({ ...passwordModal, isOpen: false });
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "Không thể đổi mật khẩu ghi chú.");
    }
  };

  const handleDisablePassword = async () => {
    if (!token || !selectedNote) return;
    if (!passForm.current) {
      setSaveMessage("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }

    try {
      const response = await api.disableNotePassword(token, selectedNote.id, passForm.current);
      setDraft(response.note);
      setNotes((prev: any) => prev.map((n: any) => n.id === selectedNote.id ? response.note : n));
      setIsUnlocked(true);
      setSaveMessage(response.message);
      setPasswordModal({ ...passwordModal, isOpen: false });
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "Không thể tắt mật khẩu ghi chú.");
    }
  };

  return (
    <div className="editor-column" style={{ position: "relative" }}>
      <div className="editor-toolbar">
        <div className="editor-date" style={{ opacity: draft?.isDeleted ? 0.7 : 1 }}>
          <CalendarDays size={18} />
          <span>{dayjs(draft?.noteDate).format("DD/MM/YYYY")}</span>
=======
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
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
        </div>
        <div className="toolbar-actions">
          {selectedNote.isDeleted ? (
            <>
<<<<<<< HEAD
              <button onClick={() => restoreNote(selectedNote.id)} title="Khôi phục ghi chú" style={{ color: "var(--success)", fontWeight: 500 }}>
                Khôi phục
              </button>
              <button onClick={() => removeNotePermanently(selectedNote.id)} title="Xóa vĩnh viễn" style={{ color: "var(--danger)", fontWeight: 500 }}>
=======
              <button onClick={() => restoreNote(selectedNote.id)} title="Khôi phục ghi chú" style={{ color: 'var(--success)', fontWeight: 500 }}>
                Khôi phục
              </button>
              <button onClick={() => removeNotePermanently(selectedNote.id)} title="Xóa vĩnh viễn" style={{ color: 'var(--danger)', fontWeight: 500 }}>
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
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
<<<<<<< HEAD
                <button 
                  onClick={() => {
                    setPassForm({ current: "", new: "", confirm: "" });
                    setPasswordModal({ isOpen: true, mode: selectedNote.isPasswordProtected ? "change" : "enable" });
                  }} 
                  title="Bảo mật ghi chú"
                >
                  <Lock size={18} style={{ color: selectedNote.isPasswordProtected ? "var(--success)" : "inherit" }} />
                </button>
              )}
              {!isReadOnly && !selectedNote.isSharedWithMe && (
                <>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleUploadImage} style={{ display: "none" }} />
                  <button onClick={() => fileInputRef.current?.click()} title="Tải ảnh">
                    <ImagePlus size={18} />
                  </button>
                </>
              )}
              {!selectedNote.isSharedWithMe && <button onClick={() => removeNote(selectedNote.id)} title="Xóa"><Trash2 size={18} /></button>}
              <button onClick={toggleRecording} title={isRecording ? "Dừng ghi âm" : "Ghi âm nội dung"}>
                <MoreHorizontal size={18} style={{ color: isRecording ? "#EF4444" : "inherit" }} />
=======
                <button onClick={() => removeNote(selectedNote.id)} title="Xóa">
                  <Trash2 size={18} />
                </button>
              )}
              <button>
                <MoreHorizontal size={18} />
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
              </button>
            </>
          )}
        </div>
      </div>

      {draft?.isDeleted && (
<<<<<<< HEAD
        <div style={{ background: "var(--accent-soft)", color: "var(--danger)", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem", border: "1px solid var(--border)" }}>
=======
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
          Ghi chú này đang nằm trong thùng rác. Bạn cần khôi phục để có thể chỉnh sửa.
        </div>
      )}

<<<<<<< HEAD
      {selectedNote.isSharedWithMe ? (
        <div style={{ marginBottom: 14, color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Chia sẻ bởi <strong>{selectedNote.ownerName || selectedNote.ownerEmail || "Người dùng"}</strong>
          {selectedNote.sharedAt ? ` lúc ${dayjs(selectedNote.sharedAt).format("DD/MM/YYYY HH:mm")}` : ""}
          {selectedNote.sharedPermission ? ` • Quyền: ${selectedNote.sharedPermission === "editor" ? "Chỉnh sửa" : "Chỉ xem"}` : ""}
        </div>
      ) : null}

      {blockedByPassword ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ background: "var(--accent-soft)", padding: 24, borderRadius: "50%", color: "var(--accent)" }}>
            <Lock size={48} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--text)" }}>Ghi chú được bảo mật</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 8 }}>Vui lòng nhập mật khẩu để xem nội dung</p>
          <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 300 }}>
            <input
              type="password"
              value={unlockPassword}
              onChange={(e) => setUnlockPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              className="modal-input"
              style={{ flex: 1, padding: "12px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            />
            <button className="primary-button" style={{ width: "auto" }} onClick={handleUnlock}>
              Mở khóa
            </button>
          </div>
          {unlockError && <p style={{ color: "#dc2626", fontSize: "0.85rem" }}>{unlockError}</p>}
        </div>
      ) : (
        <>
          <div className="title-area" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="text"
              className="title-input"
              value={draft?.title || ""}
              onChange={(event) => setDraft((current: any) => (current ? { ...current, title: event.target.value } : null))}
              placeholder="Tiêu đề ghi chú"
              disabled={isReadOnly}
            />
            {isViewerShared && (
              <span
                style={{
                  background: "var(--panel)",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  padding: "4px 8px",
                  borderRadius: 4,
                  border: "1px solid var(--border)",
                  whiteSpace: "nowrap",
                }}
              >
                Chỉ xem
              </span>
            )}
          </div>

          <div className="tag-row">
            {draft?.labels?.map((label: any) => (
              <span className="tag" key={label.id} style={{ background: `${label.color}15`, color: label.color }}>
                {label.name}
                {!isReadOnly ? <X size={12} style={{ marginLeft: 4, cursor: "pointer" }} onClick={() => removeLabelFromNote(label.id)} /> : null}
              </span>
            ))}
            {!isReadOnly ? (
              <div className="add-tag-container" style={{ position: "relative" }}>
                <span
                  className="add-tag"
                  onClick={() => {
                    setLabelNameInput("");
                    setLabelColorInput("#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"));
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
                          const randomColor = color || "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
                          if (token) {
                            try {
                              const response = await api.createLabel(token, { name: labelName.trim(), color: randomColor });
                              setLabels((prev: any) => [...prev, response.label]);
                              addLabelToNote(response.label);
                            } catch (_err) {
                              setSaveMessage("Không thể tạo nhãn mới trên server.");
                            }
                          } else {
                            const newLabel: any = { id: crypto.randomUUID(), name: labelName.trim(), color: randomColor };
                            setLabels((prev: any) => [...prev, newLabel]);
                            addLabelToNote(newLabel);
                          }
                        }
                        setLabelModal((prev: any) => ({ ...prev, isOpen: false }));
                      },
                    });
                  }}
                >
                  <Plus size={16} /> Thêm nhãn
                </span>
              </div>
            ) : null}
            {draft?.isPasswordProtected ? (
              <span className="tag" style={{ background: "var(--accent-soft)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                <Lock size={12} style={{ marginRight: 4 }} />
                Bảo vệ
              </span>
            ) : null}
          </div>

          <div className="rich-content">
            <textarea
              className="content-input"
              value={draft?.content || ""}
              onChange={(event) => setDraft((current: any) => (current ? { ...current, content: event.target.value } : null))}
              placeholder="Bắt đầu viết ghi chú của bạn..."
              readOnly={isReadOnly}
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

          {draft?.images?.length ? (
            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 12 }}>
              {draft.images.map((img: string, index: number) => {
                const fullUrl = `${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "") : "http://localhost:4000"}${img}`;
                return (
                  <div key={`${img}-${index}`} className="note-image-container" style={{ position: 'relative', width: 140, height: 100, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img
                      src={fullUrl}
                      alt={`note-image-${index}`}
                      style={{ width: '100%', height: '100%', objectFit: "cover", cursor: 'pointer' }}
                      onClick={() => setPreviewImage(fullUrl)}
                    />
                    {!isReadOnly && (
                      <button 
                        onClick={() => handleRemoveImage(img)}
                        style={{ 
                          position: 'absolute', 
                          top: 6, 
                          right: 6, 
                          background: 'rgba(239, 68, 68, 0.9)', 
                          color: 'white', 
                          padding: 4, 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          zIndex: 10
                        }}
                        className="image-delete-btn"
                        title="Xóa ảnh"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <div 
                      onClick={() => setPreviewImage(fullUrl)}
                      style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: 'rgba(0,0,0,0.4)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        opacity: 0, 
                        transition: 'opacity 0.2s',
                        cursor: 'pointer',
                        color: 'white'
                      }}
                      className="image-overlay"
                    >
                      <Eye size={24} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <footer className="editor-footer">
            <span>Cập nhật {isMounted ? dayjs(draft?.updatedAt || new Date()).format("HH:mm") : "--:--"}</span>
            <span>{draft?.content?.split(/\s+/)?.filter((w: string) => w.length > 0)?.length || 0} từ</span>
          </footer>
        </>
      )}

      {passwordModal.isOpen && (
        <div className="modal-overlay" onClick={() => setPasswordModal({ ...passwordModal, isOpen: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="modal-title" style={{ margin: 0, fontSize: "1.25rem" }}>{passwordModal.mode === "enable" ? "Bật mật khẩu" : passwordModal.mode === "change" ? "Đổi mật khẩu" : "Tắt mật khẩu"}</h3>
              <X 
                size={20} 
                style={{ cursor: "pointer", color: "var(--text-muted)", transition: "color 0.2s" }}
                onMouseOver={(e) => e.currentTarget.style.color = "var(--text)"}
                onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                onClick={() => setPasswordModal({ ...passwordModal, isOpen: false })} 
              />
            </div>

            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {passwordModal.mode !== "enable" && (
                <label className="field" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)" }}>Mật khẩu hiện tại</span>
                  <input type="password" value={passForm.current} onChange={(e) => setPassForm({ ...passForm, current: e.target.value })} className="modal-input" placeholder="Nhập mật khẩu hiện tại" style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }} />
                </label>
              )}
              {passwordModal.mode !== "disable" && (
                <>
                  <label className="field" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)" }}>Mật khẩu mới</span>
                    <input type="password" value={passForm.new} onChange={(e) => setPassForm({ ...passForm, new: e.target.value })} className="modal-input" placeholder="Nhập mật khẩu mới" style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }} />
                  </label>
                  <label className="field" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)" }}>Xác nhận mật khẩu</span>
                    <input type="password" value={passForm.confirm} onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })} className="modal-input" placeholder="Xác nhận mật khẩu mới" style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }} />
                  </label>
                </>
              )}
            </div>

            <div className="modal-footer" style={{ marginTop: 24, display: "flex", gap: 12 }}>
              {passwordModal.mode === "change" && (
                 <button className="modal-btn cancel" onClick={() => {
                   setPassForm({ current: "", new: "", confirm: "" });
                   setPasswordModal({ ...passwordModal, mode: "disable" });
                 }}>
                   Tắt mật khẩu
                 </button>
              )}
              <div style={{ flex: 1 }} />
              <button className="modal-btn cancel" onClick={() => setPasswordModal({ ...passwordModal, isOpen: false })}>Hủy</button>
              <button className="modal-btn confirm" onClick={() => {
                 if (passwordModal.mode === "enable") handleEnablePassword();
                 else if (passwordModal.mode === "change") handleChangePassword();
                 else handleDisablePassword();
              }}>Lưu</button>
            </div>
          </div>
        </div>
      )}
      {previewImage && (
        <div 
          className="modal-overlay" 
          onClick={() => setPreviewImage(null)}
          style={{ zIndex: 2000, background: 'rgba(0,0,0,0.85)', padding: 40 }}
        >
          <div style={{ position: 'relative', maxWidth: '95vw', maxHeight: '90vh' }}>
            <img 
              src={previewImage} 
              alt="Preview" 
              style={{ display: 'block', maxWidth: '100%', maxHeight: '90vh', borderRadius: 8, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} 
            />
            <button 
              onClick={() => setPreviewImage(null)}
              style={{ position: 'absolute', top: -40, right: -40, color: 'white', padding: 8 }}
            >
              <X size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
=======
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
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
