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
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  preferences?: {
    theme?: string;
    defaultView?: "list" | "grid";
    language?: string;
  } | null;
};
