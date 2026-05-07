"use client";
import { LogOut, Settings, Moon, StickyNote, LayoutGrid, Pin, Share2, Trash2, Plus } from "lucide-react";
import { useNoteFlowContext } from "./NoteFlowProvider";
import { api } from "@/lib/api";

export function Sidebar() {
  const {
    logout, createNote, sidebarFilter, toggleSidebarFilter, selectedLabelId, setSelectedLabelId,
    setSidebarFilter, labels, selectLabel, notes, handleLabelContextMenu,
    handleLabelTouchStart, handleLabelTouchEnd, setLabelNameInput, setLabelColorInput, setLabelModal, token, setLabels, setSaveMessage
  } = useNoteFlowContext();

  return (
    <>
      <nav className="narrow-sidebar">
        <div className="nav-top">
          <div className="app-icon">
            <StickyNote size={24} />
          </div>
        </div>
        <div className="nav-bottom">
          <button className="narrow-btn" onClick={logout} title="Đăng xuất">
            <LogOut size={20} />
          </button>
          <button className="narrow-btn" onClick={() => {}}>
            <Settings size={20} />
          </button>
          <button className="narrow-btn" onClick={() => {}}>
            <Moon size={20} />
          </button>
        </div>
      </nav>

      <aside className="sidebar">
        <div className="brand-block">
          <h1>NoteFlow</h1>
        </div>

        <button className="primary-button" onClick={createNote}>
          <Plus size={18} />
          Ghi chú mới
        </button>

        <nav className="sidebar-nav">
          <button className={sidebarFilter === "all" && !selectedLabelId ? "active" : ""} onClick={() => toggleSidebarFilter("all")}>
            <LayoutGrid size={18} />
            Tất cả ghi chú
          </button>
          <button className={sidebarFilter === "pinned" && !selectedLabelId ? "active" : ""} onClick={() => { setSidebarFilter("pinned"); setSelectedLabelId(null); }}>
            <Pin size={18} />
            Đã ghim
          </button>
          <button className={sidebarFilter === "shared" && !selectedLabelId ? "active" : ""} onClick={() => { setSidebarFilter("shared"); setSelectedLabelId(null); }}>
            <Share2 size={18} />
            Đã chia sẻ với tôi
          </button>
          <button className={sidebarFilter === "trash" && !selectedLabelId ? "active" : ""} onClick={() => { setSidebarFilter("trash"); setSelectedLabelId(null); }}>
            <Trash2 size={18} />
            Thùng rác
          </button>
        </nav>

        <div className="sidebar-section">
          <div className="section-head">
            <span>Nhãn</span>
            <button type="button" style={{ color: "var(--text-muted)", fontSize: "1.2rem", cursor: "pointer" }} onClick={() => {
              setLabelNameInput("");
              setLabelColorInput("#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
              setLabelModal({
                isOpen: true,
                title: "Thêm nhãn mới",
                initialName: "",
                initialColor: "#4F46E5",
                onConfirm: async (labelName: string, color: string) => {
                  if (!labelName.trim()) return;
                  const randomColor = color || ("#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
                  if (token) {
                    try {
                      const response = await api.createLabel(token, { name: labelName.trim(), color: randomColor });
                      setLabels((prev: any) => [...prev, response.label]);
                    } catch (err) {
                      setSaveMessage("Không thể tạo nhãn mới trên server.");
                    }
                  } else {
                    setLabels((prev: any) => [...prev, { id: crypto.randomUUID(), name: labelName.trim(), color: randomColor }]);
                  }
                  setLabelModal((prev: any) => ({ ...prev, isOpen: false }));
                }
              });
            }}>+</button>
          </div>
          <div className="label-list">
            {labels.map((label: any) => (
              <div 
                className={`label-row ${selectedLabelId === label.id ? "active" : ""}`} 
                key={label.id}
                onClick={() => selectLabel(label.id)}
                onContextMenu={(e) => handleLabelContextMenu(e, label.id)}
                onTouchStart={(e) => handleLabelTouchStart(e, label.id)}
                onTouchEnd={handleLabelTouchEnd}
                onTouchCancel={handleLabelTouchEnd}
                onTouchMove={handleLabelTouchEnd}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                <span className="dot" style={{ background: label.color }} />
                <span>{label.name}</span>
                <strong>{label.noteCount ?? notes.filter((note: any) => note.labels.some((item: any) => item.id === label.id)).length}</strong>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}