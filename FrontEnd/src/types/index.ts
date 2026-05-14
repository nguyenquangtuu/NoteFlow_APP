export type Label = {
  id: string;
  name: string;
  color: string;
  noteCount?: number;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  noteDate: string;
  isPinned: boolean;
  pinnedAt?: string | null;
  isDeleted: boolean;
  isPasswordProtected: boolean;
  images: string[];
  shareToken?: string | null;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
  labels: Label[];
  isSharedWithMe?: boolean;
  sharedPermission?: string;
  sharedAt?: string;
  ownerName?: string;
  ownerEmail?: string;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  isActive?: boolean;
  preferences?: {
    theme?: "light" | "dark";
    defaultView?: "list" | "grid";
    language?: string;
    fontSize?: string;
    noteColor?: string;
  } | null;
};
