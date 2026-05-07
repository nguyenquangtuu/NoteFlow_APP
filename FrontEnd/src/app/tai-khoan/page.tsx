"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { mockUser } from "@/lib/mock-data";
import type { User } from "@/types";

export default function ProfilePage() {
  const [user, setUser] = useState<User>(mockUser);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("noteflow_token");
    if (!token) return;

    api.getProfile(token)
      .then((response) => setUser(response.user))
      .catch((error) => setMessage(error.message));
  }, []);

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = window.localStorage.getItem("noteflow_token");
    if (!token) {
      setMessage("Can dang nhap de cap nhat tai khoan.");
      return;
    }

    try {
      const response = await api.updateProfile(token, user);
      setUser(response.user);
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Khong the cap nhat tai khoan.");
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = window.localStorage.getItem("noteflow_token");
    if (!token) {
      setMessage("Can dang nhap de doi mat khau.");
      return;
    }

    try {
      const response = await api.changePassword(token, { currentPassword, newPassword });
      setMessage(response.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Khong the doi mat khau.");
    }
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div>
          <p className="eyebrow">Tai khoan</p>
          <h1>Ho so va tuy chon</h1>
        </div>

        <form className="form-stack" onSubmit={updateProfile}>
          <label>
            Ho va ten
            <input
              value={user.fullName}
              onChange={(event) => setUser((current) => ({ ...current, fullName: event.target.value }))}
            />
          </label>
          <label>
            Email
            <input value={user.email} readOnly />
          </label>
          <label>
            Avatar URL
            <input
              value={user.avatarUrl || ""}
              onChange={(event) => setUser((current) => ({ ...current, avatarUrl: event.target.value }))}
            />
          </label>
          <button className="primary-button" type="submit">
            Luu thong tin
          </button>
        </form>
      </section>

      <section className="profile-card">
        <h2>Doi mat khau</h2>
        <form className="form-stack" onSubmit={changePassword}>
          <label>
            Mat khau hien tai
            <input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type="password" />
          </label>
          <label>
            Mat khau moi
            <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" />
          </label>
          <button className="primary-button" type="submit">
            Doi mat khau
          </button>
          {message ? <p className="form-message">{message}</p> : null}
        </form>
      </section>
    </main>
  );
}
