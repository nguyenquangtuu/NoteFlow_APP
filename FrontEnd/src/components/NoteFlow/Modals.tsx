"use client";
import { useNoteFlowContext } from "./NoteFlowProvider";
import { X, Copy, Check, UserPlus, Trash2, Globe, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export function Modals() {
  const { 
    token, setSaveMessage,
    confirmModal, setConfirmModal, 
    labelModal, setLabelModal, 
    labelNameInput, setLabelNameInput, 
    labelColorInput, setLabelColorInput,
    shareModal, setShareModal, generateShareLink,
    labelContextMenu, setLabelContextMenu,
    editLabel, deleteLabel
  } = useNoteFlowContext();

  const [copied, setCopied] = useState(false);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (labelContextMenu.isOpen) {
        setLabelContextMenu(prev => ({ ...prev, isOpen: false }));
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [labelContextMenu.isOpen, setLabelContextMenu]);

  const handleCopyLink = () => {
    if (shareModal.link) {
      navigator.clipboard.writeText(shareModal.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUpdatePublicPermission = async (permission: string) => {
    if (!token) return;
    try {
      await api.updatePublicPermission(token, shareModal.noteId, permission);
      setShareModal(prev => ({ ...prev, publicPermission: permission }));
      setSaveMessage("Đã cập nhật quyền.");
    } catch (e: any) {
      setSaveMessage(e.message || "Lỗi cập nhật quyền.");
    }
  };

  const handleAddShareUser = async () => {
    if (!token || !shareModal.newUserEmail) return;
    try {
      await api.addNoteShareUser(token, shareModal.noteId, shareModal.newUserEmail, shareModal.newUserPermission);
      setShareModal(prev => ({
        ...prev,
        shares: [...prev.shares.filter(s => s.email !== prev.newUserEmail), { email: prev.newUserEmail, permission: prev.newUserPermission }],
        newUserEmail: ""
      }));
      setSaveMessage("Đã thêm người dùng.");
    } catch (e: any) {
      setSaveMessage(e.message || "Lỗi thêm người dùng.");
    }
  };

  const handleRemoveShareUser = async (email: string) => {
    if (!token) return;
    try {
      await api.removeNoteShareUser(token, shareModal.noteId, email);
      setShareModal(prev => ({
        ...prev,
        shares: prev.shares.filter(s => s.email !== email)
      }));
      setSaveMessage("Đã xóa người dùng.");
    } catch (e: any) {
      setSaveMessage(e.message || "Lỗi xóa người dùng.");
    }
  };

  return (
    <>
      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">{confirmModal.title}</h3>
            <p className="modal-message">{confirmModal.message}</p>
            <div className="modal-actions">
              <button 
                className="modal-btn cancel"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              >
                Hủy
              </button>
              <button 
                className={`modal-btn ${confirmModal.isDestructive ? 'danger' : 'confirm'}`}
                onClick={() => {
                  confirmModal.onConfirm();
                }}
              >
                {confirmModal.confirmText || "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Label Modal */}
      {labelModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="modal-title">{labelModal.title}</h3>
              <X 
                size={20} 
                style={{ cursor: "pointer", color: "var(--text-muted)", transition: "color 0.2s" }} 
                onMouseOver={(e) => e.currentTarget.style.color = "var(--text)"}
                onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                onClick={() => setLabelModal(prev => ({ ...prev, isOpen: false }))} 
              />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "var(--text)" }}>Tên nhãn</label>
                <input 
                  type="text" 
                  className="modal-input"
                  value={labelNameInput}
                  onChange={(e) => setLabelNameInput(e.target.value)}
                  placeholder="Ví dụ: Công việc, Học tập..."
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 500, color: "var(--text)" }}>Màu sắc</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input 
                    type="color" 
                    className="modal-input"
                    style={{ padding: "0", height: "40px", width: "40px", cursor: "pointer", border: "none" }}
                    value={labelColorInput}
                    onChange={(e) => setLabelColorInput(e.target.value)}
                  />
                  <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                    {labelColorInput.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: "16px" }}>
              <button 
                className="modal-btn cancel"
                onClick={() => setLabelModal(prev => ({ ...prev, isOpen: false }))}
              >
                Hủy
              </button>
              <button 
                className="modal-btn confirm"
                style={{ opacity: !labelNameInput.trim() ? 0.5 : 1, cursor: !labelNameInput.trim() ? 'not-allowed' : 'pointer' }} 
                onClick={() => {
                  if (labelNameInput.trim()) {
                    labelModal.onConfirm(labelNameInput, labelColorInput);
                  }
                }}
                disabled={!labelNameInput.trim()}
              >
                Lưu nhãn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="modal-title">Chia sẻ ghi chú</h3>
              <X 
                size={20} 
                style={{ cursor: "pointer", color: "var(--text-muted)", transition: "color 0.2s" }}
                onMouseOver={(e) => e.currentTarget.style.color = "var(--text)"}
                onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                onClick={() => setShareModal(prev => ({ ...prev, isOpen: false }))} 
              />
            </div>

            {shareModal.isLoading ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                Đang tải thông tin chia sẻ...
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
                {/* Public Link Area */}
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>
                    <Globe size={16} /> Liên kết công khai
                  </label>
                  
                  {shareModal.link ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input 
                          type="text" 
                          readOnly 
                          value={shareModal.link} 
                          className="modal-input"
                          style={{ flex: 1, fontSize: "0.85rem", color: "var(--text-muted)" }} 
                        />
                        <button 
                          className="modal-btn confirm"
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: "0 12px" }}
                          onClick={handleCopyLink}
                          title="Sao chép"
                        >
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      <select 
                        className="modal-input"
                        value={shareModal.publicPermission}
                        onChange={(e) => handleUpdatePublicPermission(e.target.value)}
                        style={{ padding: "8px 12px" }}
                      >
                        <option value="none">Bị hạn chế</option>
                        <option value="viewer">Người có liên kết (Chỉ xem)</option>
                        <option value="editor">Người có liên kết (Chỉnh sửa)</option>
                      </select>
                    </div>
                  ) : (
                    <button 
                      className="modal-btn confirm"
                      style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                      onClick={generateShareLink}
                      disabled={shareModal.isGenerating}
                    >
                      {shareModal.isGenerating ? "Đang tạo..." : "Tạo liên kết chia sẻ"}
                    </button>
                  )}
                </div>

                <hr style={{ border: 0, borderTop: "1px solid var(--border)" }} />

                {/* Specific Users Area */}
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>
                    <Users size={16} /> Những người có quyền truy cập
                  </label>

                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                    <input 
                      type="email" 
                      className="modal-input"
                      placeholder="Thêm email người dùng..."
                      value={shareModal.newUserEmail}
                      onChange={(e) => setShareModal(prev => ({ ...prev, newUserEmail: e.target.value }))}
                      style={{ flex: 1, padding: "8px 12px" }}
                    />
                    <select 
                      className="modal-input"
                      value={shareModal.newUserPermission}
                      onChange={(e) => setShareModal(prev => ({ ...prev, newUserPermission: e.target.value }))}
                      style={{ width: "auto", padding: "8px 12px" }}
                    >
                      <option value="viewer">Người xem</option>
                      <option value="editor">Người chỉnh sửa</option>
                    </select>
                    <button 
                      className="modal-btn confirm"
                      style={{ padding: "0 12px", display: "flex", alignItems: "center", justifyContent: "center" }}
                      onClick={handleAddShareUser}
                      disabled={!shareModal.newUserEmail.trim()}
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "150px", overflowY: "auto", paddingRight: "4px" }}>
                    {shareModal.shares.length === 0 ? (
                      <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", padding: "12px 0" }}>
                        Chưa có người dùng nào được thêm.
                      </div>
                    ) : (
                      shareModal.shares.map((share, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg)", borderRadius: "8px" }}>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{share.email}</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{share.permission === "editor" ? "Người chỉnh sửa" : "Người xem"}</span>
                          </div>
                          <button 
                            style={{ color: "#EF4444", padding: "4px", borderRadius: "4px", background: "rgba(239, 68, 68, 0.1)" }}
                            onClick={() => handleRemoveShareUser(share.email)}
                            title="Gỡ quyền"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Label Context Menu */}
      {labelContextMenu.isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: labelContextMenu.y,
            left: labelContextMenu.x,
            backgroundColor: 'var(--panel)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            padding: '4px',
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
            minWidth: '150px',
            animation: 'fadeIn 0.15s ease'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            style={{ padding: '10px 12px', textAlign: 'left', background: 'none', border: 'none', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '4px', width: '100%', color: 'var(--text)', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              editLabel(labelContextMenu.labelId);
              setLabelContextMenu(prev => ({ ...prev, isOpen: false }));
            }}
          >
            Chỉnh sửa nhãn
          </button>
          <button 
            style={{ padding: '10px 12px', textAlign: 'left', background: 'none', border: 'none', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '4px', width: '100%', color: '#EF4444', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              deleteLabel(labelContextMenu.labelId);
              setLabelContextMenu(prev => ({ ...prev, isOpen: false }));
            }}
          >
            Xóa nhãn
          </button>
        </div>
      )}
    </>
  );
}