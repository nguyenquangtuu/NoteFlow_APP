
"use client";
import { useNoteFlowContext } from "./NoteFlowProvider";
import { Sidebar } from "./Sidebar";
import { NoteList } from "./NoteList";
import { NoteEditor } from "./NoteEditor";
import { Modals } from "./Modals";
import { Toasts } from "./Toasts";

export function NoteFlowLayout() {
  const {
    search, setSearch, saveMessage, viewMode, setViewMode,
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

        <div className="content-grid">
          <NoteList />
          <NoteEditor />
        </div>
      </section>
      <Modals />
      <Toasts />
    </main>
  );
}
