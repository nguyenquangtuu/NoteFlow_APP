import type { Label, Note, User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`${response.status}: ${data.message || "Không thể xử lý yêu cầu."}`);
  }
  return data;
}

async function uploadImage(token: string, noteId: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/notes/${noteId}/images`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Không thể tải ảnh lên.");
  }
  return data as { message: string; images: string[] };
}

export const api = {
  register: (payload: { fullName: string; email: string; password: string; confirmPassword: string }) =>
    request<{ message: string; activationToken?: string; token: string; user: User }>("/auth/register", {
      method: "POST",
      body: payload,
    }),
  activate: (token: string) =>
    request<{ message: string }>("/auth/activate", { method: "POST", body: { token } }),
  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/login", { method: "POST", body: payload }),
  forgotPassword: (email: string) =>
    request<{ message: string; resetToken?: string }>("/auth/forgot-password", {
      method: "POST",
      body: { email },
    }),
  resetPassword: (token: string, password: string) =>
    request<{ message: string }>("/auth/reset-password", { method: "POST", body: { token, password } }),
  me: (token: string) => request<{ user: User }>("/auth/me", { token }),
  changePassword: (token: string, payload: { currentPassword: string; newPassword: string }) =>
    request<{ message: string }>("/auth/change-password", { method: "POST", body: payload, token }),
  getProfile: (token: string) => request<{ user: User }>("/users/profile", { token }),
  updateProfile: (token: string, payload: Partial<User>) =>
    request<{ message: string; user: User }>("/users/profile", { method: "PUT", body: payload, token }),
  getLabels: (token: string) => request<{ labels: Label[] }>("/labels", { token }),
  createLabel: (token: string, payload: { name: string; color: string }) =>
    request<{ message: string; label: Label }>("/labels", { method: "POST", body: payload, token }),
  updateLabel: (token: string, id: string, payload: { name: string; color: string }) =>
    request<{ message: string }>(`/labels/${id}`, { method: "PUT", body: payload, token }),
  deleteLabel: (token: string, id: string) => request<{ message: string }>(`/labels/${id}`, { method: "DELETE", token }),
  getNotes: (token: string, params = "") => request<{ notes: Note[] }>(`/notes${params}`, { token }),
  createNote: (
    token: string,
    payload: Partial<Note> & { noteDate?: string; labelIds?: string[]; notePassword?: string },
  ) => request<{ message: string; note: Note }>("/notes", { method: "POST", body: payload, token }),
  updateNote: (
    token: string,
    id: string,
    payload: Partial<Note> & { labelIds?: string[]; notePassword?: string; clearPassword?: boolean; noteAccessPassword?: string },
  ) => request<{ message: string; note: Note }>(`/notes/${id}`, { method: "PUT", body: payload, token }),
  deleteNote: (token: string, id: string, noteAccessPassword?: string) =>
    request<{ message: string }>(`/notes/${id}`, { method: "DELETE", body: { noteAccessPassword }, token }),
  deleteNotePermanently: (token: string, id: string, noteAccessPassword?: string) =>
    request<{ message: string }>(`/notes/${id}/permanent`, { method: "DELETE", body: { noteAccessPassword }, token }),
  shareNote: (token: string, id: string) => request<{ message: string; shareUrl: string }>(`/notes/${id}/share`, { method: "POST", token }),
  getNoteShares: (token: string, id: string) =>
    request<{ publicPermission: string; shareToken: string; shares: { email: string; permission: string; created_at?: string }[] }>(
      `/notes/${id}/shares`,
      { token },
    ),
  updatePublicPermission: (token: string, id: string, permission: string) =>
    request<{ message: string }>(`/notes/${id}/shares/public`, { method: "PUT", body: { permission }, token }),
  addNoteShareUser: (token: string, id: string, email: string, permission: string) =>
    request<{ message: string }>(`/notes/${id}/shares/user`, { method: "POST", body: { email, permission }, token }),
  removeNoteShareUser: (token: string, id: string, email: string) =>
    request<{ message: string }>(`/notes/${id}/shares/user/${email}`, { method: "DELETE", token }),
  uploadNoteImage: (token: string, noteId: string, file: File) => uploadImage(token, noteId, file),
  verifyNotePassword: (token: string, id: string, password: string) =>
    request<{ message: string; note: Note }>(`/notes/${id}/password/verify`, { method: "POST", body: { password }, token }),
  enableNotePassword: (token: string, id: string, password: string, confirmPassword: string) =>
    request<{ message: string; note: Note }>(`/notes/${id}/password/enable`, {
      method: "POST",
      body: { password, confirmPassword },
      token,
    }),
  changeNotePassword: (
    token: string,
    id: string,
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) =>
    request<{ message: string; note: Note }>(`/notes/${id}/password`, {
      method: "PUT",
      body: { currentPassword, newPassword, confirmNewPassword },
      token,
    }),
  disableNotePassword: (token: string, id: string, currentPassword: string) =>
    request<{ message: string; note: Note }>(`/notes/${id}/password/disable`, {
      body: { currentPassword },
      token,
    }),
  testPush: (token: string) =>
    request<{ message: string }>("/notifications/test-push", { method: "POST", token }),
};
