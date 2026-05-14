"use client";
import { LogOut, Settings, Moon, StickyNote, LayoutGrid, Pin, Trash2, Plus, Users, ChevronDown } from "lucide-react";
import { useNoteFlowContext } from "./NoteFlowProvider";
import { api } from "@/lib/api";

export function Sidebar() {
  const {
    logout,
    createNote,
    sidebarFilter,
    toggleSidebarFilter,
    selectedLabelId,
    setSelectedLabelId,
    setSidebarFilter,
    labels,
    selectLabel,
    notes,
    handleLabelContextMenu,
    handleLabelTouchStart,
    handleLabelTouchEnd,
    setLabelNameInput,
    setLabelColorInput,
    setLabelModal,
    token,
    setLabels,
    setSaveMessage,
    toggleTheme,
    user,
    setProfileModalOpen,
    setIsSidebarOpen
  } = useNoteFlowContext();

  return (
    <aside className="sidebar" suppressHydrationWarning>
      {/* Brand Block */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 8 }}>
        <div style={{ width: 44, height: 44, background: "var(--accent)", color: "white", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <StickyNote size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: "1.25rem", margin: 0, fontWeight: 700, color: "var(--accent)", lineHeight: 1.2 }}>NoteFlow</h1>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>Ghi chú thông minh</span>
        </div>
      </div>

      <button className="primary-button" onClick={() => { createNote(); setIsSidebarOpen(false); }} style={{ borderRadius: "10px", padding: "12px", width: "100%", justifyContent: "center" }}>
        <Plus size={18} />
        Ghi chú mới
      </button>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 24, paddingRight: 4 }}>
        {/* QUẢN LÝ section */}
        <div className="sidebar-section" style={{ gap: 8 }}>
          <div className="section-head" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 8px 4px 8px", color: "var(--text-muted)", fontWeight: 600 }}>
            QUẢN LÝ
          </div>
          <nav className="sidebar-nav" style={{ gap: 4 }}>
            <button 
              className={sidebarFilter === "all" && !selectedLabelId ? "active" : ""} 
              onClick={() => toggleSidebarFilter("all")}
              style={{ borderLeft: sidebarFilter === "all" && !selectedLabelId ? "4px solid var(--accent)" : "4px solid transparent", borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }}
            >
              <LayoutGrid size={18} style={{ color: sidebarFilter === "all" && !selectedLabelId ? "var(--accent)" : "var(--text-muted)" }} />
              Tất cả ghi chú
            </button>
            <button
              className={sidebarFilter === "pinned" && !selectedLabelId ? "active" : ""}
              onClick={() => { setSidebarFilter("pinned"); setSelectedLabelId(null); }}
              style={{ borderLeft: sidebarFilter === "pinned" && !selectedLabelId ? "4px solid var(--accent)" : "4px solid transparent", borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }}
            >
              <Pin size={18} style={{ color: sidebarFilter === "pinned" && !selectedLabelId ? "var(--accent)" : "var(--text-muted)" }} />
              Đã ghim
            </button>
            <button
              className={sidebarFilter === "shared" && !selectedLabelId ? "active" : ""}
              onClick={() => { setSidebarFilter("shared"); setSelectedLabelId(null); }}
              style={{ borderLeft: sidebarFilter === "shared" && !selectedLabelId ? "4px solid var(--accent)" : "4px solid transparent", borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }}
            >
              <Users size={18} style={{ color: sidebarFilter === "shared" && !selectedLabelId ? "var(--accent)" : "var(--text-muted)" }} />
              Đã chia sẻ với tôi
            </button>
            <button
              className={sidebarFilter === "trash" && !selectedLabelId ? "active" : ""}
              onClick={() => { setSidebarFilter("trash"); setSelectedLabelId(null); }}
              style={{ borderLeft: sidebarFilter === "trash" && !selectedLabelId ? "4px solid var(--accent)" : "4px solid transparent", borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }}
            >
              <Trash2 size={18} style={{ color: sidebarFilter === "trash" && !selectedLabelId ? "var(--accent)" : "var(--text-muted)" }} />
              Thùng rác
            </button>
          </nav>
        </div>

        {/* NHÃN section */}
        <div className="sidebar-section" style={{ gap: 8 }}>
          <div className="section-head" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 8px 4px 8px", color: "var(--text-muted)", fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>NHÃN</span>
            <Plus 
              size={16} 
              style={{ cursor: "pointer", transition: "color 0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.color = "var(--text)"}
              onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
              onClick={() => {
                setLabelNameInput("");
                setLabelColorInput("#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"));
                setLabelModal({
                  isOpen: true,
                  title: "Thêm nhãn mới",
                  initialName: "",
                  initialColor: "#4F46E5",
                  onConfirm: async (labelName: string, color: string) => {
                    if (!labelName.trim()) return;
                    const randomColor = color || "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
                    if (token) {
                      try {
                        const response = await api.createLabel(token, { name: labelName.trim(), color: randomColor });
                        setLabels((prev: any) => [...prev, response.label]);
                      } catch (_err) {
                        setSaveMessage("Không thể tạo nhãn mới trên server.");
                      }
                    } else {
                      setLabels((prev: any) => [...prev, { id: crypto.randomUUID(), name: labelName.trim(), color: randomColor }]);
                    }
                    setLabelModal((prev: any) => ({ ...prev, isOpen: false }));
                  },
                });
              }}
            />
          </div>
          <div className="label-list" style={{ gap: 4 }}>
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
                style={{ cursor: "pointer", userSelect: "none", padding: "8px 12px", display: "flex", alignItems: "center", gap: 12, borderRadius: 8, margin: "0 4px" }}
              >
                <span className="dot" style={{ background: label.color, width: 10, height: 10, borderRadius: "50%", flexShrink: 0 }} />
                <span style={{ fontWeight: 500, fontSize: "0.9rem", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text)" }}>{label.name}</span>
                <span style={{ background: "var(--bg)", padding: "2px 8px", borderRadius: 12, fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  {label.noteCount ?? notes.filter((note: any) => note.labels.some((item: any) => item.id === label.id)).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "0 8px" }} />

      {/* User Profile & Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "0 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "opacity 0.2s" }} onMouseOver={(e) => e.currentTarget.style.opacity="0.8"} onMouseOut={(e) => e.currentTarget.style.opacity="1"} onClick={() => setProfileModalOpen(true)}>
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}&background=E2E8F0&color=1E293B`} alt="Avatar" style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0 }} />
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{user?.fullName || "Người dùng"}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{user?.email || "email@example.com"}</div>
          </div>
          <ChevronDown size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        </div>

        <nav className="sidebar-nav" style={{ gap: 4 }}>
          <button onClick={() => setProfileModalOpen(true)} style={{ color: "var(--text-muted)", fontWeight: 500, padding: "8px 12px" }}>
            <Settings size={18} />
            Cài đặt
          </button>
          <button onClick={logout} style={{ color: "var(--text-muted)", fontWeight: 500, padding: "8px 12px" }}>
            <LogOut size={18} />
            Đăng xuất
          </button>
        </nav>
      </div>

    </aside>
  );
}
