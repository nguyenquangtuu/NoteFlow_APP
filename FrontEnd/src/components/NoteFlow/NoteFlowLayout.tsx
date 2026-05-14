
"use client";
import { useNoteFlowContext } from "./NoteFlowProvider";
import { Sidebar } from "./Sidebar";
import { NoteList } from "./NoteList";
import { NoteEditor } from "./NoteEditor";
import { Modals } from "./Modals";
import { Toasts } from "./Toasts";
<<<<<<< HEAD
import { ProfileModal } from "./ProfileModal";
import { Moon, Menu, X, Bell } from "lucide-react";
import { useEffect } from "react";
import { registerServiceWorker, subscribeUserToPush } from "@/utils/push-notification";
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739

export function NoteFlowLayout() {
  const {
    search, setSearch, saveMessage, viewMode, setViewMode,
<<<<<<< HEAD
    showAllDates, setShowAllDates, selectedDate, setSelectedDate, user, toggleTheme,
    isSidebarOpen, toggleSidebar, setIsSidebarOpen
  } = useNoteFlowContext();

  useEffect(() => {
    const setupPush = async () => {
      await registerServiceWorker();
      // Yêu cầu quyền và đăng ký push sau khi đã đăng nhập
      if (user) {
        if (Notification.permission === 'default') {
          // Có thể hiển thị một popup nhẹ nhàng yêu cầu bật thông báo ở đây
          // Để đơn giản tôi sẽ yêu cầu luôn
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            await subscribeUserToPush();
          }
        } else if (Notification.permission === 'granted') {
          await subscribeUserToPush();
        }
      }
    };
    setupPush();
  }, [user]);

  return (
    <main className={`dashboard-shell ${isSidebarOpen ? 'sidebar-open' : ''}`} suppressHydrationWarning>
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
        suppressHydrationWarning
      />
      <Sidebar />
      <section className="workspace">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button 
              className="mobile-menu-toggle"
              onClick={toggleSidebar}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                cursor: 'pointer'
              }}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <label className="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm kiếm ghi chú..."
              />
              <span>⌘ K</span>
            </label>
          </div>

          <div className="topbar-actions">
            {saveMessage && <span className="save-status">{saveMessage}</span>}
            <button onClick={toggleTheme} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-muted)", cursor: "pointer", transition: "all 0.2s" }} title="Đổi giao diện Sáng / Tối">
              <Moon size={18} />
            </button>
=======
    showAllDates, setShowAllDates, selectedDate
  } = useNoteFlowContext();

  return (
    <main className="dashboard-shell">
      <Sidebar />
      <section className="workspace">
        <header className="topbar">
          <label className="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm ghi chú..."
            />
            <span>⌘ K</span>
          </label>

          <div className="topbar-actions">
            {saveMessage && <span className="save-status">{saveMessage}</span>}
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
            <div className="view-toggle">
              <button className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              </button>
              <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "stretch" }}>
              <button 
                className={`date-filter ${showAllDates ? "active" : ""}`}
                onClick={() => setShowAllDates(!showAllDates)}
                style={!showAllDates ? { borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none', paddingRight: '8px' } : {}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                {showAllDates ? "Tất cả các ngày" : "Ngày:"}
              </button>
              {!showAllDates && (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    padding: "0 12px 0 4px",
                    background: "var(--panel)",
                    border: "1px solid var(--border)",
                    borderLeft: "none",
                    borderTopRightRadius: "var(--radius-lg)",
                    borderBottomRightRadius: "var(--radius-lg)",
                    color: "var(--text)",
                    fontFamily: "inherit",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    outline: "none"
                  }}
                />
              )}
            </div>
          </div>
        </header>

<<<<<<< HEAD
        {user && user.isActive === false ? (
          <div style={{
            margin: "0 28px 16px",
            border: "1px solid #FBBF24",
            background: "#FFFBEB",
            color: "#92400E",
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: 500
          }}>
            Tài khoản chưa kích hoạt email. Bạn vẫn sử dụng được đầy đủ tính năng, vui lòng kiểm tra email để kích hoạt.
          </div>
        ) : null}

=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
        <div className="content-grid">
          <NoteList />
          <NoteEditor />
        </div>
      </section>
      <Modals />
<<<<<<< HEAD
      <ProfileModal />
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
      <Toasts />
    </main>
  );
}
