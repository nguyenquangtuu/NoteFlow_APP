
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useEffect, useEffectEvent, useMemo, useState, useTransition, useDeferredValue, useRef } from "react";
import { io } from "socket.io-client";
import { api } from "@/lib/api";
<<<<<<< HEAD
=======
import { mockLabels, mockNotes, mockUser } from "@/lib/mock-data";
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
import type { Label, Note, User } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

dayjs.locale("vi");
type ViewMode = "list" | "grid";
type SidebarFilter = "all" | "pinned" | "shared" | "trash";
const tokenStorageKey = "noteflow_token";

function parseChecklist(content: string) {
  return content
    .split("\n")
    .filter((line) => line.startsWith("["))
    .map((line) => ({
      text: line.replace(/^\[[x ]\]\s*/, ""),
      checked: line.startsWith("[x]"),
    }));
}

export function useNoteFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
<<<<<<< HEAD
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
=======
  const [token, setToken] = useState<string | null>(() =>
    typeof window === "undefined" ? null : window.localStorage.getItem(tokenStorageKey),
  );
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [labels, setLabels] = useState<Label[]>(mockLabels);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  const [sidebarFilter, setSidebarFilter] = useState<SidebarFilter>("all");
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [showAllDates, setShowAllDates] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    noteId: string;
    link: string;
    publicPermission: string;
    shares: { email: string; permission: string }[];
    newUserEmail: string;
    newUserPermission: string;
    isLoading: boolean;
    isGenerating: boolean;
  }>({ isOpen: false, noteId: "", link: "", publicPermission: "none", shares: [], newUserEmail: "", newUserPermission: "viewer", isLoading: false, isGenerating: false });
  const [isPending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
    confirmText?: string;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  const [labelModal, setLabelModal] = useState<{
    isOpen: boolean;
    title: string;
    initialName: string;
    initialColor: string;
    onConfirm: (name: string, color: string) => void;
  }>({ isOpen: false, title: "", initialName: "", initialColor: "#4F46E5", onConfirm: () => {} });
  
  const [labelNameInput, setLabelNameInput] = useState("");
  const [labelColorInput, setLabelColorInput] = useState("#4F46E5");

  const [labelContextMenu, setLabelContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    labelId: string;
  }>({ isOpen: false, x: 0, y: 0, labelId: "" });

<<<<<<< HEAD
  const [profileModalOpen, setProfileModalOpen] = useState(false);

=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const [draft, setDraft] = useState<Note | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [showOnlineToast, setShowOnlineToast] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
<<<<<<< HEAD
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsOnline(typeof window !== "undefined" ? window.navigator.onLine : true);
    const currentToken = typeof window === "undefined" ? null : window.localStorage.getItem(tokenStorageKey);
    
    if (currentToken) {
      setToken(currentToken);
      
      const cachedUser = localStorage.getItem("noteflow_cache_user");
      if (cachedUser) setUser(JSON.parse(cachedUser));
      
      const cachedNotes = localStorage.getItem("noteflow_cache_notes");
      if (cachedNotes) setNotes(JSON.parse(cachedNotes));

      const cachedLabels = localStorage.getItem("noteflow_cache_labels");
      if (cachedLabels) setLabels(JSON.parse(cachedLabels));
    }

    setIsMounted(true);
  }, []);

  useEffect(() => {
    const preferences = user?.preferences;
    if (!preferences || typeof document === "undefined") return;

    const root = document.documentElement;
    const theme = preferences.theme || "light";
    const fontSize = preferences.fontSize || "16";

    root.setAttribute("data-theme", theme);
    root.style.setProperty("--note-font-size", `${Number(fontSize) || 16}px`);
    
    if (preferences.noteColor && preferences.noteColor.toUpperCase() !== "#FFFFFF") {
      root.style.setProperty("--note-surface", preferences.noteColor);
    } else {
      root.style.removeProperty("--note-surface");
    }
  }, [user?.preferences]);

  useEffect(() => {
=======

  useEffect(() => {
    setIsMounted(true);
    setIsOnline(typeof window !== "undefined" ? window.navigator.onLine : true);

    // Load from cache on mount to avoid hydration mismatch
    const cachedUser = localStorage.getItem("noteflow_cache_user");
    if (cachedUser) setUser(JSON.parse(cachedUser));

    const cachedNotes = localStorage.getItem("noteflow_cache_notes");
    if (cachedNotes) setNotes(JSON.parse(cachedNotes));

    const cachedLabels = localStorage.getItem("noteflow_cache_labels");
    if (cachedLabels) setLabels(JSON.parse(cachedLabels));
  }, []);

  useEffect(() => {
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
    if (!isOnline) {
      setWasOffline(true);
    } else if (isOnline && wasOffline) {
      setShowOnlineToast(true);
      const timer = setTimeout(() => setShowOnlineToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  const isSyncingRef = useRef(false);

  const syncOfflineData = async () => {
    if (!token) return;
    if (isSyncingRef.current) return;
    
    const initialQueueJson = localStorage.getItem("noteflow_offline_queue");
    if (!initialQueueJson || JSON.parse(initialQueueJson).length === 0) return;

    isSyncingRef.current = true;
    
    try {
      let isQueueEmpty = false;
      let successCount = 0;
      
      while (!isQueueEmpty) {
        const queueJson = localStorage.getItem("noteflow_offline_queue");
        if (!queueJson) break;
        
        const queue = JSON.parse(queueJson);
        if (!queue.length) break;
        
        const action = queue[0];
        let actionSuccessful = false;
        
        try {
          if (action.type === 'CREATE_NOTE') {
            await api.createNote(token, action.payload);
          } else if (action.type === 'UPDATE_NOTE') {
            await api.updateNote(token, action.id, action.payload);
          } else if (action.type === 'DELETE_NOTE_PERMANENT') {
            await api.deleteNotePermanently(token, action.id);
          }
          actionSuccessful = true;
        } catch (e: any) {
          console.warn("Lỗi đồng bộ item:", action, e);
          break; // Stop syncing on error to preserve order and retry later
        }
        
        if (actionSuccessful) {
          successCount++;
          const currentQueueStr = localStorage.getItem("noteflow_offline_queue");
          if (currentQueueStr) {
             const currentQueue = JSON.parse(currentQueueStr);
             const index = currentQueue.findIndex((a: any) => 
               a.actionId === action.actionId || 
               (a.type === action.type && (a.id === action.id || (a.payload && action.payload && a.payload.id === action.payload.id)))
             );
             if (index !== -1) {
               currentQueue.splice(index, 1);
               if (currentQueue.length === 0) {
                 localStorage.removeItem("noteflow_offline_queue");
                 isQueueEmpty = true;
               } else {
                 localStorage.setItem("noteflow_offline_queue", JSON.stringify(currentQueue));
               }
             }
          }
        }
      }
      
      if (successCount > 0) {
        const response = await api.getNotes(token, "?view=all");
        setNotes(response.notes);
        setSaveMessage("Đã đồng bộ xong dữ liệu ngoại tuyến!");
      }
    } finally {
      isSyncingRef.current = false;
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSaveMessage("Đang ngoại tuyến. Dữ liệu sẽ được lưu nội bộ.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Auto-retry syncing every 10 seconds if there's a queue
    const syncInterval = setInterval(() => {
      if (typeof window !== "undefined" && window.navigator.onLine) {
        const queueJson = localStorage.getItem("noteflow_offline_queue");
        if (queueJson && JSON.parse(queueJson).length > 0) {
          syncOfflineData();
        }
      }
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
    };
  }, [token]);

  function enqueueOfflineAction(action: any) {
    if (typeof window === "undefined") return;
    const queueJson = localStorage.getItem("noteflow_offline_queue");
    let queue = queueJson ? JSON.parse(queueJson) : [];
    
    if (action.type === 'UPDATE_NOTE') {
      queue = queue.filter((a: any) => !(a.type === 'UPDATE_NOTE' && a.id === action.id));
    }
    if (action.type === 'DELETE_NOTE_PERMANENT') {
      queue = queue.filter((a: any) => a.id !== action.id);
    }
    
    action.actionId = crypto.randomUUID();
    queue.push(action);
    localStorage.setItem("noteflow_offline_queue", JSON.stringify(queue));
  }

  const persistDraft = useEffectEvent(async (nextDraft: Note) => {
    // Luôn cập nhật local state để UI mượt mà
    setNotes((current) => current.map((note) => (note.id === nextDraft.id ? { ...nextDraft, updatedAt: new Date().toISOString() } : note)));

    if (!token) {
      setSaveMessage("Đang ở chế độ demo (không lưu vào database)");
      return;
    }

    try {
      const response = await api.updateNote(token, nextDraft.id, {
        title: nextDraft.title,
        content: nextDraft.content,
        noteDate: nextDraft.noteDate,
        isPinned: nextDraft.isPinned,
        images: nextDraft.images,
        labelIds: nextDraft.labels.map((label) => label.id),
      });

      setSaveMessage(`Đã tự động lưu lúc ${dayjs().format("HH:mm")}`);
      
      // If we just successfully saved to server, it's a good time to ensure any other offline actions are pushed too.
      const queueJson = localStorage.getItem("noteflow_offline_queue");
      if (queueJson && JSON.parse(queueJson).length > 0) {
        syncOfflineData();
      }
    } catch (error) {
      if (!isOnline || error instanceof TypeError || (error as Error).message === "Failed to fetch") {
        enqueueOfflineAction({
          type: "UPDATE_NOTE",
          id: nextDraft.id,
          payload: {
            title: nextDraft.title,
            content: nextDraft.content,
            noteDate: nextDraft.noteDate,
            isPinned: nextDraft.isPinned,
            images: nextDraft.images,
            labelIds: nextDraft.labels.map((label) => label.id),
          }
        });
        setSaveMessage(`Đã lưu ngoại tuyến lúc ${dayjs().format("HH:mm")}`);
      } else {
        setSaveMessage("Không thể lưu. Vui lòng kiểm tra kết nối.");
      }
    }
  });

  useEffect(() => {
<<<<<<< HEAD
    if (!isMounted) return;

    if (!token) {
      router.push("/dang-nhap");
=======
    if (typeof window !== "undefined" && !token) {
      router.push("/dang-ky");
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
      return;
    }

    if (!token) return;

    startTransition(async () => {
      if (typeof window !== "undefined") {
        const queueJson = localStorage.getItem("noteflow_offline_queue");
        if (queueJson && JSON.parse(queueJson).length > 0 && window.navigator.onLine) {
           await syncOfflineData();
           // syncOfflineData already fetches the latest notes, so just fetch user/labels
           try {
             const [me, labelResponse] = await Promise.all([
               api.me(token),
               api.getLabels(token),
             ]);
             setUser(me.user);
             setLabels(labelResponse.labels);
             if (me.user.preferences?.defaultView) setViewMode(me.user.preferences.defaultView);
           } catch(e) {}
           return;
        }
      }

      try {
        const [me, noteResponse, labelResponse] = await Promise.all([
          api.me(token),
          api.getNotes(token, "?view=all"),
          api.getLabels(token),
        ]);
        setUser(me.user);
        setNotes(noteResponse.notes);
        setLabels(labelResponse.labels);
        
        if (me.user.preferences?.defaultView) {
          setViewMode(me.user.preferences.defaultView);
        }

        // Check if there's a noteId in URL to select immediately
        const sharedNoteId = searchParams?.get("noteId");
        if (sharedNoteId) {
          const noteToSelect = noteResponse.notes.find((n: Note) => n.id === sharedNoteId);
          if (noteToSelect) {
            setSelectedNoteId(sharedNoteId);
            setDraft(noteToSelect);
            setSidebarFilter(noteToSelect.isSharedWithMe ? "shared" : "all");
            // optionally clean up the URL to just /
            window.history.replaceState({}, '', '/');
          }
        }
<<<<<<< HEAD
      } catch (err: any) {
        if (err.message?.includes("401") || err.message?.includes("Phiên đăng nhập") || err.message?.includes("Token hết hạn")) {
          logout();
          return;
        }

=======
      } catch (err) {
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
        if (typeof window !== "undefined" && !window.navigator.onLine) {
          setSaveMessage("Bạn đang dùng chế độ ngoại tuyến.");
        } else {
          setSaveMessage("Không thể tải dữ liệu mới nhất. Đang hiển thị bản lưu tạm.");
        }
      }
    });
  }, [token]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) localStorage.setItem("noteflow_cache_user", JSON.stringify(user));
      localStorage.setItem("noteflow_cache_notes", JSON.stringify(notes));
      localStorage.setItem("noteflow_cache_labels", JSON.stringify(labels));
    }
  }, [user, notes, labels]);


  // Real-time synchronization
  useEffect(() => {
    if (!token || !user?.id) return;
    
    const socketUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : "http://localhost:4000";
    const socket = io(socketUrl, {
      query: { userId: user.id },
      withCredentials: true
    });

    socket.on("connect", () => {
      console.log("Socket connected for real-time sync");
    });

    socket.on("note_updated", (data: { note: Note, updatedBy: string }) => {
      // Ignore if we were the ones updating it
      if (data.updatedBy === user.id) return;

      setNotes(prev => {
        const idx = prev.findIndex(n => n.id === data.note.id);
        if (idx !== -1) {
          const updatedList = [...prev];
          updatedList[idx] = { 
            ...data.note, 
            isSharedWithMe: prev[idx].isSharedWithMe, 
            sharedPermission: prev[idx].sharedPermission 
          };
          return updatedList;
        }
        return prev;
      });

      setDraft(current => {
        if (current && current.id === data.note.id) {
          return { 
            ...data.note, 
            isSharedWithMe: current.isSharedWithMe, 
            sharedPermission: current.sharedPermission 
          };
        }
        return current;
      });
    });

<<<<<<< HEAD
    socket.on("note_shared", (data: { note: Note, sharedBy: string }) => {
      setNotes(prev => {
        // Tránh trùng lặp nếu đã có trong list
        if (prev.some(n => n.id === data.note.id)) return prev;
        return [data.note, ...prev];
      });
      
      setSaveMessage(`Bạn vừa nhận được ghi chú từ ${data.sharedBy}!`);
      setTimeout(() => setSaveMessage(""), 5000);
    });

=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
    return () => {
      socket.disconnect();
    };
  }, [token, user?.id]);

  const [lastSavedId, setLastSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (!draft?.id || draft.isDeleted) return;
    
    const originalNote = notes.find(n => n.id === draft.id);
    if (!originalNote) return;

    const isChanged = 
      originalNote.title !== draft.title || 
      originalNote.content !== draft.content ||
      originalNote.isPinned !== draft.isPinned ||
      originalNote.noteDate !== draft.noteDate ||
<<<<<<< HEAD
      JSON.stringify(originalNote.labels) !== JSON.stringify(draft.labels) ||
      JSON.stringify(originalNote.images) !== JSON.stringify(draft.images);
=======
      JSON.stringify(originalNote.labels) !== JSON.stringify(draft.labels);
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739

    // Chỉ lưu nếu có thay đổi thực sự
    if (!isChanged) return;

    const timeout = window.setTimeout(() => {
      persistDraft(draft);
      setLastSavedId(draft.id);
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [draft, notes]);

  const visibleNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesFilter =
        sidebarFilter === "all"
          ? !note.isDeleted
          : sidebarFilter === "pinned"
            ? note.isPinned && !note.isDeleted && !note.isSharedWithMe
            : sidebarFilter === "shared"
              ? note.isSharedWithMe && !note.isDeleted
              : note.isDeleted;

      const matchesLabel = !selectedLabelId || note.labels.some((l) => l.id === selectedLabelId);
      const matchesDate = showAllDates || sidebarFilter === "trash" ? true : note.noteDate === selectedDate;
      
      const keyword = deferredSearch.toLowerCase();
      const matchesSearch =
        !keyword ||
        note.title.toLowerCase().includes(keyword) ||
        note.content.toLowerCase().includes(keyword) ||
        note.labels.some((label) => label.name.toLowerCase().includes(keyword));

      return matchesFilter && matchesLabel && matchesDate && matchesSearch;
    }).sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
<<<<<<< HEAD
      if (a.isPinned && b.isPinned) {
        return dayjs(b.pinnedAt || b.updatedAt || 0).valueOf() - dayjs(a.pinnedAt || a.updatedAt || 0).valueOf();
      }
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
      const order = sortOrder === "newest" ? 1 : -1;
      if (a.noteDate !== b.noteDate) return (dayjs(b.noteDate).valueOf() - dayjs(a.noteDate).valueOf()) * order;
      return (dayjs(b.updatedAt || 0).valueOf() - dayjs(a.updatedAt || 0).valueOf()) * order;
    });
  }, [notes, sidebarFilter, selectedLabelId, selectedDate, showAllDates, deferredSearch, sortOrder]);

  const selectedNote = visibleNotes.find((note) => note.id === selectedNoteId) || draft;

  const listTitle = useMemo(() => {
    if (selectedLabelId) {
      const label = labels.find((l) => l.id === selectedLabelId);
      return label ? `Nhãn: ${label.name}` : "Danh sách ghi chú";
    }
    switch (sidebarFilter) {
      case "pinned": return "Ghi chú đã ghim";
      case "shared": return "Đã chia sẻ với tôi";
      case "trash": return "Thùng rác";
      default: return "Tất cả ghi chú";
    }
  }, [sidebarFilter, selectedLabelId, labels]);

  const days = Array.from({ length: 7 }, (_, index) =>
    dayjs().startOf("week").add(index + 1, "day").format("YYYY-MM-DD"),
  );

  async function createNote() {
    setSidebarFilter("all");
    setSelectedLabelId(null);
    setShowAllDates(true);

    const tempNote: Note = {
      id: crypto.randomUUID(),
      title: "Ghi chú mới",
      content: "Mô tả công việc hoặc ý tưởng tại đây...",
      noteDate: selectedDate,
      isPinned: false,
      isDeleted: false,
      isPasswordProtected: false,
      images: [],
      labels: [],
      updatedAt: new Date().toISOString(),
    };

    setNotes((current) => [tempNote, ...current]);
    setSelectedNoteId(tempNote.id);
    setDraft(tempNote);

    if (!token) return;
    try {
      const response = await api.createNote(token, {
        id: tempNote.id,
        title: tempNote.title,
        content: tempNote.content,
        noteDate: tempNote.noteDate,
        labelIds: tempNote.labels.map((label) => label.id),
      });
      setNotes((current) => current.map((note) => (note.id === tempNote.id ? response.note : note)));
      setSelectedNoteId(response.note.id);
      setDraft(response.note);
    } catch (error) {
      if (!isOnline || error instanceof TypeError || (error as Error).message === "Failed to fetch") {
        enqueueOfflineAction({
          type: "CREATE_NOTE",
          payload: {
            id: tempNote.id,
            title: tempNote.title,
            content: tempNote.content,
            noteDate: tempNote.noteDate,
            labelIds: tempNote.labels.map((label) => label.id),
          }
        });
        setSaveMessage("Đã tạo ngoại tuyến.");
      } else {
        setSaveMessage(error instanceof Error ? error.message : "Không thể tạo ghi chú mới.");
      }
    }
  }

<<<<<<< HEAD
  async function removeNote(id: string) {
    setNotes((current) => current.map((note) => (note.id === id ? { ...note, isDeleted: true } : note)));
    if (token) {
      try {
        await api.deleteNote(token, id);
      } catch(error) {
        if (!isOnline || error instanceof TypeError || (error as Error).message === "Failed to fetch") {
          enqueueOfflineAction({ type: "UPDATE_NOTE", id: id, payload: { isDeleted: true } });
        }
      }
    }
    setSidebarFilter("trash");
    setSaveMessage("Đã chuyển ghi chú vào thùng rác.");
=======
  function removeNote(id: string) {
    setConfirmModal({
      isOpen: true,
      title: "Chuyển vào thùng rác",
      message: "Bạn có chắc chắn muốn chuyển ghi chú này vào thùng rác không?",
      confirmText: "Chuyển",
      isDestructive: true,
      onConfirm: async () => {
        setNotes((current) => current.map((note) => (note.id === id ? { ...note, isDeleted: true } : note)));
        if (token) {
          try {
            await api.deleteNote(token, id);
          } catch(error) {
            if (!isOnline || error instanceof TypeError || (error as Error).message === "Failed to fetch") {
              enqueueOfflineAction({ type: "UPDATE_NOTE", id: id, payload: { isDeleted: true } });
            }
          }
        }
        setSidebarFilter("trash");
        setSaveMessage("Đã chuyển ghi chú vào thùng rác.");
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  }

  async function restoreNote(id: string) {
    setNotes((current) => current.map((note) => (note.id === id ? { ...note, isDeleted: false } : note)));
    if (token) {
      try {
        await api.updateNote(token, id, { isDeleted: false });
      } catch(error) {
        if (!isOnline || error instanceof TypeError || (error as Error).message === "Failed to fetch") {
          enqueueOfflineAction({ type: "UPDATE_NOTE", id: id, payload: { isDeleted: false } });
        }
      }
    }
    setSidebarFilter("all");
    setSaveMessage("Đã khôi phục ghi chú.");
  }

  function removeNotePermanently(id: string) {
    setConfirmModal({
      isOpen: true,
      title: "Xóa vĩnh viễn",
      message: "Ghi chú này sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có chắc chắn?",
      confirmText: "Xóa",
      isDestructive: true,
      onConfirm: async () => {
        setNotes((current) => current.filter((note) => note.id !== id));
        if (draft?.id === id) setDraft(null);
        if (token) {
          try {
            await api.deleteNotePermanently(token, id);
          } catch(error) {
            if (!isOnline || error instanceof TypeError || (error as Error).message === "Failed to fetch") {
              enqueueOfflineAction({ type: "DELETE_NOTE_PERMANENT", id: id });
            }
          }
        }
        setSaveMessage("Đã xóa vĩnh viễn.");
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }

  async function togglePin(note: Note) {
    const next = { ...note, isPinned: !note.isPinned };
    setNotes((current) => current.map((item) => (item.id === note.id ? next : item)));
    setDraft(next);

    if (token) {
      try {
        await api.updateNote(token, note.id, { isPinned: next.isPinned });
      } catch(error) {
        if (!isOnline || error instanceof TypeError || (error as Error).message === "Failed to fetch") {
          enqueueOfflineAction({ type: "UPDATE_NOTE", id: note.id, payload: { isPinned: next.isPinned } });
        }
      }
    }
  }

  async function addLabelToNote(label: Label) {
    if (!draft) return;
    if (draft.labels.some((l) => l.id === label.id)) return;
    const next = { ...draft, labels: [...draft.labels, label] };
    setDraft(next);
  }

  async function removeLabelFromNote(labelId: string) {
    if (!draft) return;
    const next = { ...draft, labels: draft.labels.filter((l) => l.id !== labelId) };
    setDraft(next);
  }

  function toggleSidebarFilter(filter: SidebarFilter) {
    setSidebarFilter(filter);
    setSelectedLabelId(null);
<<<<<<< HEAD
    setIsSidebarOpen(false);
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  }

  function selectLabel(labelId: string) {
    setSelectedLabelId(labelId);
    setSidebarFilter("all");
<<<<<<< HEAD
    setIsSidebarOpen(false);
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  }

  function editLabel(labelId: string) {
    const label = labels.find(l => l.id === labelId);
    if (!label) return;
    
    setLabelNameInput(label.name);
    setLabelColorInput(label.color || "#4F46E5");
    setLabelModal({
      isOpen: true,
      title: "Chỉnh sửa nhãn",
      initialName: label.name,
      initialColor: label.color || "#4F46E5",
      onConfirm: async (name, color) => {
        if (!name.trim()) return;
        setLabels(prev => prev.map(l => l.id === labelId ? { ...l, name: name.trim(), color } : l));
        setNotes(prev => prev.map(n => ({
          ...n,
          labels: n.labels.map(l => l.id === labelId ? { ...l, name: name.trim(), color } : l)
        })));
        if (draft) {
          setDraft(prev => prev ? ({
            ...prev,
            labels: prev.labels.map(l => l.id === labelId ? { ...l, name: name.trim(), color } : l)
          }) : null);
        }
        if (token) {
          try { await api.updateLabel(token, labelId, { name: name.trim(), color }); }
          catch (err) { setSaveMessage("Không thể cập nhật nhãn trên server."); }
        }
        setLabelModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }

  function deleteLabel(labelId: string) {
    setConfirmModal({
      isOpen: true,
      title: "Xóa nhãn",
      message: "Bạn có chắc chắn muốn xóa nhãn này? Ghi chú chứa nhãn này sẽ không bị xóa.",
      confirmText: "Xóa nhãn",
      isDestructive: true,
      onConfirm: async () => {
        setLabels(prev => prev.filter(l => l.id !== labelId));
        if (selectedLabelId === labelId) setSelectedLabelId(null);
        setNotes(prev => prev.map(n => ({ ...n, labels: n.labels.filter(l => l.id !== labelId) })));
        if (draft) {
          setDraft(prev => prev ? ({ ...prev, labels: prev.labels.filter(l => l.id !== labelId) }) : null);
        }
        if (token) {
          try { await api.deleteLabel(token, labelId); }
          catch (err) { setSaveMessage("Không thể xóa nhãn trên server."); }
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }

  const handleLabelContextMenu = (e: React.MouseEvent, labelId: string) => {
    e.preventDefault();
    setLabelContextMenu({ isOpen: true, x: e.clientX, y: e.clientY, labelId });
  };

  const handleLabelTouchStart = (e: React.TouchEvent, labelId: string) => {
    const touch = e.touches[0];
    longPressTimer.current = setTimeout(() => {
      setLabelContextMenu({ isOpen: true, x: touch.clientX, y: touch.clientY, labelId });
    }, 500);
  };

  const handleLabelTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  async function openShareModal(note: Note) {
    if (!token) {
<<<<<<< HEAD
      setSaveMessage("Vui lòng đăng nhập để sử dụng tính năng chia sẻ.");
=======
      setShareModal(prev => ({ ...prev, isOpen: true, noteId: note.id, link: "Chế độ demo: http://localhost:3000/chia-se/demo-token", publicPermission: "none", shares: [] }));
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
      return;
    }
    
    setShareModal(prev => ({ ...prev, isOpen: true, noteId: note.id, isLoading: true, link: note.shareToken ? `${window.location.origin}/chia-se/${note.shareToken}` : "" }));
    try {
      const res = await api.getNoteShares(token, note.id);
      setShareModal(prev => ({ 
        ...prev, 
        isLoading: false,
        publicPermission: res.publicPermission,
        link: res.shareToken ? `${window.location.origin}/chia-se/${res.shareToken}` : "",
        shares: res.shares || []
      }));
    } catch(e) {
      setShareModal(prev => ({ ...prev, isLoading: false }));
    }
  }

  async function generateShareLink() {
    if (!shareModal.noteId) return;
    
    if (!token) {
<<<<<<< HEAD
      setSaveMessage("Vui lòng đăng nhập để sử dụng tính năng chia sẻ.");
=======
      setShareModal(prev => ({ ...prev, link: "Chế độ demo: http://localhost:3000/chia-se/demo-token" }));
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
      return;
    }
    
    setShareModal(prev => ({ ...prev, isGenerating: true }));
    try {
      const response = await api.shareNote(token, shareModal.noteId);
      const url = response.shareUrl;
      const shareToken = url.split('/').pop() || "";
      
      setNotes(prev => prev.map(n => n.id === shareModal.noteId ? { ...n, shareToken } : n));
      if (draft?.id === shareModal.noteId) {
        setDraft(prev => prev ? { ...prev, shareToken } : null);
      }
      
      setShareModal(prev => ({ ...prev, link: url, isGenerating: false }));
    } catch (error) {
      setShareModal(prev => ({ ...prev, isGenerating: false }));
      setSaveMessage(error instanceof Error ? error.message : "Không thể tạo liên kết chia sẻ.");
    }
  }

  async function refreshLatestNoteFromServer(noteId: string) {
    if (!token) return null;

    try {
      const response = await api.getNotes(token, "?view=all");
      setNotes(response.notes);
      return response.notes.find((n) => n.id === noteId) ?? null;
    } catch {
      return null;
    }
  }

  function logout() {
    window.localStorage.removeItem(tokenStorageKey);
<<<<<<< HEAD
    window.localStorage.removeItem("noteflow_cache_user");
    window.localStorage.removeItem("noteflow_cache_notes");
    window.localStorage.removeItem("noteflow_cache_labels");
    window.localStorage.removeItem("noteflow_offline_queue");
    setToken(null);
    setUser(null);
    setNotes([]);
    setLabels([]);
    setSaveMessage("Đã đăng xuất.");
    router.push("/dang-nhap");
  }

  async function toggleTheme() {
    const currentTheme = user?.preferences?.theme || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    setUser((current) => {
      if (!current) return current;
      return {
        ...current,
        preferences: {
          ...(current.preferences || {}),
          theme: nextTheme,
        },
      };
    });

    if (token) {
      try {
        await api.updateProfile(token, {
          preferences: {
            theme: nextTheme,
          },
        });
      } catch (_error) {
        setSaveMessage("Không thể cập nhật giao diện.");
      }
    }
  }

=======
    setToken(null);
    setUser(mockUser);
    setNotes(mockNotes);
    setLabels(mockLabels);
    setSaveMessage("Đã đăng xuất. Giao diện quay về chế độ demo.");
    router.push("/dang-nhap");
  }

>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  async function selectNote(note: Note) {
    const latestNote = await refreshLatestNoteFromServer(note.id);
    const noteToOpen = latestNote ?? note;

    setSelectedNoteId(noteToOpen.id);
    setDraft(noteToOpen);
  }

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
<<<<<<< HEAD
    logout, toggleTheme, generateShareLink, openShareModal, handleLabelContextMenu, handleLabelTouchStart, handleLabelTouchEnd,
    addLabelToNote, removeLabelFromNote, toggleSidebarFilter, selectLabel, editLabel, deleteLabel,
    createNote, removeNote, restoreNote, removeNotePermanently, togglePin, selectNote,
    visibleNotes, selectedNote, listTitle, days, persistDraft, parseChecklist,
    profileModalOpen, setProfileModalOpen,
    isSidebarOpen, setIsSidebarOpen,
    toggleSidebar: () => setIsSidebarOpen(!isSidebarOpen)
=======
    logout, generateShareLink, openShareModal, handleLabelContextMenu, handleLabelTouchStart, handleLabelTouchEnd,
    addLabelToNote, removeLabelFromNote, toggleSidebarFilter, selectLabel, editLabel, deleteLabel,
    createNote, removeNote, restoreNote, removeNotePermanently, togglePin, selectNote,
    visibleNotes, selectedNote, listTitle, days, persistDraft, parseChecklist
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  };
}

export type NoteFlowState = ReturnType<typeof useNoteFlow>;
<<<<<<< HEAD

=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
