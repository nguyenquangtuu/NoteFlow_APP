import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('src/components/note-flow-app.tsx', 'utf8');

const returnIndex = content.indexOf('return (\n    <main className="dashboard-shell">');

const logicPart = content.slice(0, returnIndex);
const jsxPart = content.slice(returnIndex);

let customHook = `
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useEffect, useEffectEvent, useMemo, useState, useTransition, useDeferredValue, useRef } from "react";
import { io } from "socket.io-client";
import { api } from "@/lib/api";
import { mockLabels, mockNotes, mockUser } from "@/lib/mock-data";
import type { Label, Note, User } from "@/types";
import { useRouter } from "next/navigation";

dayjs.locale("vi");
type ViewMode = "list" | "grid";
type SidebarFilter = "all" | "pinned" | "shared" | "trash";
const tokenStorageKey = "noteflow_token";

function parseChecklist(content: string) {
  return content
    .split("\\n")
    .filter((line) => line.startsWith("["))
    .map((line) => ({
      text: line.replace(/^\\[[x ]\\]\\s*/, ""),
      checked: line.startsWith("[x]"),
    }));
}

export function useNoteFlow() {
`;

// Extract the inside of NoteFlowApp function
const appStartIndex = logicPart.indexOf('export default function NoteFlowApp() {') + 'export default function NoteFlowApp() {'.length;
const appLogic = logicPart.slice(appStartIndex).trim();

customHook += appLogic + '\n';
customHook += `
  return {
    token, setToken, user, setUser, notes, setNotes, labels, setLabels,
    selectedNoteId, setSelectedNoteId, selectedDate, setSelectedDate,
    search, setSearch, deferredSearch, isPending, viewMode, setViewMode,
    sidebarFilter, setSidebarFilter, selectedLabelId, setSelectedLabelId,
    showAllDates, setShowAllDates, saveMessage, setSaveMessage, isMounted, setIsMounted,
    sortOrder, setSortOrder, draft, setDraft, isOnline, setIsOnline,
    showOnlineToast, setShowOnlineToast, wasOffline, setWasOffline,
    confirmModal, setConfirmModal, labelModal, setLabelModal, shareModal, setShareModal,
    labelNameInput, setLabelNameInput, labelColorInput, setLabelColorInput,
    labelContextMenu, setLabelContextMenu,
    logout, generateShareLink, openShareModal, handleLabelContextMenu, handleLabelTouchStart, handleLabelTouchEnd,
    addLabelToNote, removeLabelFromNote, toggleSidebarFilter, selectLabel, editLabel, deleteLabel,
    createNote, removeNote, restoreNote, removeNotePermanently, togglePin, selectNote,
    visibleNotes, selectedNote, listTitle, days, persistDraft, parseChecklist
  };
}

export type NoteFlowState = ReturnType<typeof useNoteFlow>;
`;

fs.mkdirSync('src/hooks', { recursive: true });
fs.writeFileSync('src/hooks/useNoteFlow.ts', customHook);
console.log('Created useNoteFlow.ts');

const newAppTsx = `
"use client";
import { NoteFlowProvider } from "./NoteFlow/NoteFlowProvider";
import { NoteFlowLayout } from "./NoteFlow/NoteFlowLayout";

export default function NoteFlowApp() {
  return (
    <NoteFlowProvider>
      <NoteFlowLayout />
    </NoteFlowProvider>
  );
}
`;

fs.writeFileSync('src/components/note-flow-app.tsx', newAppTsx);
console.log('Updated note-flow-app.tsx');

// NoteFlowProvider.tsx
const providerTsx = `
"use client";
import { createContext, useContext } from "react";
import { useNoteFlow, NoteFlowState } from "@/hooks/useNoteFlow";

export const NoteFlowContext = createContext<NoteFlowState | null>(null);

export const useNoteFlowContext = () => {
  const context = useContext(NoteFlowContext);
  if (!context) throw new Error("useNoteFlowContext must be used within NoteFlowProvider");
  return context;
};

export function NoteFlowProvider({ children }: { children: React.ReactNode }) {
  const state = useNoteFlow();
  return <NoteFlowContext.Provider value={state}>{children}</NoteFlowContext.Provider>;
}
`;

fs.writeFileSync('src/components/NoteFlow/NoteFlowProvider.tsx', providerTsx);

const layoutTsx = `
"use client";
import { useNoteFlowContext } from "./NoteFlowProvider";
import { Sidebar } from "./Sidebar";
import { NoteList } from "./NoteList";
import { NoteEditor } from "./NoteEditor";
import { Modals } from "./Modals";
import { Toasts } from "./Toasts";

export function NoteFlowLayout() {
  const state = useNoteFlowContext();
  return (
    <main className="dashboard-shell">
      <Sidebar />
      <section className="workspace">
        <NoteList />
        <NoteEditor />
      </section>
      <Modals />
      <Toasts />
    </main>
  );
}
`;

fs.writeFileSync('src/components/NoteFlow/NoteFlowLayout.tsx', layoutTsx);

// Just create placeholders for now, we'll fill them with actual JSX next.
const sidebarTsx = `import { useNoteFlowContext } from "./NoteFlowProvider"; export function Sidebar() { return null; }`;
const noteListTsx = `import { useNoteFlowContext } from "./NoteFlowProvider"; export function NoteList() { return null; }`;
const noteEditorTsx = `import { useNoteFlowContext } from "./NoteFlowProvider"; export function NoteEditor() { return null; }`;
const modalsTsx = `import { useNoteFlowContext } from "./NoteFlowProvider"; export function Modals() { return null; }`;
const toastsTsx = `import { useNoteFlowContext } from "./NoteFlowProvider"; export function Toasts() { return null; }`;

fs.writeFileSync('src/components/NoteFlow/Sidebar.tsx', sidebarTsx);
fs.writeFileSync('src/components/NoteFlow/NoteList.tsx', noteListTsx);
fs.writeFileSync('src/components/NoteFlow/NoteEditor.tsx', noteEditorTsx);
fs.writeFileSync('src/components/NoteFlow/Modals.tsx', modalsTsx);
fs.writeFileSync('src/components/NoteFlow/Toasts.tsx', toastsTsx);

console.log('Refactor setup complete.');
