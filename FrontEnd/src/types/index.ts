<<<<<<< HEAD
﻿export type Label = {
=======
export type Label = {
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
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
<<<<<<< HEAD
  pinnedAt?: string | null;
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
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
<<<<<<< HEAD
  sharedAt?: string;
  ownerName?: string;
  ownerEmail?: string;
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
<<<<<<< HEAD
  isActive?: boolean;
  preferences?: {
    theme?: "light" | "dark";
    defaultView?: "list" | "grid";
    language?: string;
    fontSize?: string;
    noteColor?: string;
=======
  preferences?: {
    theme?: string;
    defaultView?: "list" | "grid";
    language?: string;
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  } | null;
};
