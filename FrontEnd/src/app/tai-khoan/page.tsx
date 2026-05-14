<<<<<<< HEAD
﻿"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import type { User } from "@/types";

export default function ProfilePage() {
  const [user, setUser] = useState<User>({
    id: "",
    fullName: "",
    email: "",
    avatarUrl: "",
    preferences: {
      theme: "light",
      defaultView: "grid",
      fontSize: "16",
      noteColor: "#FFFFFF",
      language: "vi",
    },
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
=======
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
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739

  useEffect(() => {
    const token = window.localStorage.getItem("noteflow_token");
    if (!token) return;

<<<<<<< HEAD
    api
      .getProfile(token)
      .then((response) => setUser(response.user))
      .catch((error) => setProfileMessage(error.message));
=======
    api.getProfile(token)
      .then((response) => setUser(response.user))
      .catch((error) => setMessage(error.message));
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  }, []);

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = window.localStorage.getItem("noteflow_token");
    if (!token) {
<<<<<<< HEAD
      setProfileMessage("Cần đăng nhập để cập nhật tài khoản.");
=======
      setMessage("Can dang nhap de cap nhat tai khoan.");
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
      return;
    }

    try {
      const response = await api.updateProfile(token, user);
      setUser(response.user);
<<<<<<< HEAD
      setProfileMessage(response.message || "Đã lưu thông tin tài khoản.");
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : "Không thể cập nhật tài khoản.");
=======
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Khong the cap nhat tai khoan.");
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = window.localStorage.getItem("noteflow_token");
    if (!token) {
<<<<<<< HEAD
      setPasswordMessage("Cần đăng nhập để đổi mật khẩu.");
=======
      setMessage("Can dang nhap de doi mat khau.");
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
      return;
    }

    try {
      const response = await api.changePassword(token, { currentPassword, newPassword });
<<<<<<< HEAD
      setPasswordMessage(response.message || "Đổi mật khẩu thành công.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      setPasswordMessage(error instanceof Error ? error.message : "Không thể đổi mật khẩu.");
    }
  }

  const preferences = user.preferences || {};

  return (
    <main className="profile-page">
      <section className="profile-card profile-main-card">
        <div className="profile-head">
          <Link href="/" className="profile-back-link">
            <ArrowLeft size={16} />
            Quay lại ghi chú
          </Link>
          <p className="eyebrow">Tài khoản</p>
          <h1>Hồ sơ và tuỳ chọn</h1>
          <p className="profile-subtitle">Cập nhật thông tin cá nhân và tuỳ chỉnh giao diện làm việc của bạn.</p>
          {user.isActive === false ? (
            <p className="profile-warning">Tài khoản chưa kích hoạt email. Bạn vẫn có thể dùng hệ thống bình thường.</p>
          ) : null}
        </div>

        <form className="form-stack profile-form" onSubmit={updateProfile}>
          <label className="field">
            Họ và tên
            <input
              className="field-control"
=======
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
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
              value={user.fullName}
              onChange={(event) => setUser((current) => ({ ...current, fullName: event.target.value }))}
            />
          </label>
<<<<<<< HEAD
          <label className="field">
            Email
            <input className="field-control" value={user.email} readOnly />
          </label>
          <label className="field">
            Avatar URL
            <input
              className="field-control"
=======
          <label>
            Email
            <input value={user.email} readOnly />
          </label>
          <label>
            Avatar URL
            <input
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
              value={user.avatarUrl || ""}
              onChange={(event) => setUser((current) => ({ ...current, avatarUrl: event.target.value }))}
            />
          </label>
<<<<<<< HEAD

          <div className="field">
            <span>Giao diện</span>
            <div className="radio-group">
              <label className={`radio-option ${(preferences.theme || "light") === "light" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={(preferences.theme || "light") === "light"}
                  onChange={(event) =>
                    setUser((current) => ({
                      ...current,
                      preferences: {
                        ...(current.preferences || {}),
                        theme: event.target.value as "light" | "dark",
                      },
                    }))
                  }
                />
                <span>Sáng</span>
              </label>
              <label className={`radio-option ${(preferences.theme || "light") === "dark" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={(preferences.theme || "light") === "dark"}
                  onChange={(event) =>
                    setUser((current) => ({
                      ...current,
                      preferences: {
                        ...(current.preferences || {}),
                        theme: event.target.value as "light" | "dark",
                      },
                    }))
                  }
                />
                <span>Tối</span>
              </label>
            </div>
          </div>

          <label className="field">
            Kích thước chữ ghi chú
            <select
              className="field-control"
              value={preferences.fontSize || "16"}
              onChange={(event) =>
                setUser((current) => ({
                  ...current,
                  preferences: {
                    ...(current.preferences || {}),
                    fontSize: event.target.value,
                  },
                }))
              }
            >
              <option value="14">Nhỏ</option>
              <option value="16">Vừa</option>
              <option value="18">Lớn</option>
            </select>
          </label>

          <label className="field">
            Màu nền ghi chú
            <div className="color-picker-row">
              <input
                className="color-picker"
                type="color"
                value={preferences.noteColor || "#FFFFFF"}
                onChange={(event) =>
                  setUser((current) => ({
                    ...current,
                    preferences: {
                      ...(current.preferences || {}),
                      noteColor: event.target.value,
                    },
                  }))
                }
              />
              <span className="color-value">{(preferences.noteColor || "#FFFFFF").toUpperCase()}</span>
            </div>
          </label>

          <div className="field">
            <span>Kiểu hiển thị mặc định</span>
            <div className="radio-group">
              <label className={`radio-option ${(preferences.defaultView || "grid") === "grid" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="defaultView"
                  value="grid"
                  checked={(preferences.defaultView || "grid") === "grid"}
                  onChange={(event) =>
                    setUser((current) => ({
                      ...current,
                      preferences: {
                        ...(current.preferences || {}),
                        defaultView: event.target.value as "list" | "grid",
                      },
                    }))
                  }
                />
                <span>Lưới (Grid)</span>
              </label>
              <label className={`radio-option ${(preferences.defaultView || "grid") === "list" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="defaultView"
                  value="list"
                  checked={(preferences.defaultView || "grid") === "list"}
                  onChange={(event) =>
                    setUser((current) => ({
                      ...current,
                      preferences: {
                        ...(current.preferences || {}),
                        defaultView: event.target.value as "list" | "grid",
                      },
                    }))
                  }
                />
                <span>Danh sách (List)</span>
              </label>
            </div>
          </div>

          <button className="primary-button" type="submit">
            Lưu thông tin
          </button>
          {profileMessage ? <p className="form-message">{profileMessage}</p> : null}
        </form>
      </section>

      <section className="profile-card profile-security-card">
        <div className="profile-head">
          <p className="eyebrow">Bảo mật</p>
          <h2>Đổi mật khẩu</h2>
          <p className="profile-subtitle">Mật khẩu mới nên có ít nhất 8 ký tự để đảm bảo an toàn.</p>
        </div>

        <form className="form-stack profile-form" onSubmit={changePassword}>
          <label className="field">
            Mật khẩu hiện tại
            <input
              className="field-control"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              type="password"
              required
            />
          </label>
          <label className="field">
            Mật khẩu mới
            <input
              className="field-control"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              type="password"
              required
            />
          </label>
          <button className="primary-button" type="submit">
            Đổi mật khẩu
          </button>
          {passwordMessage ? <p className="form-message">{passwordMessage}</p> : null}
=======
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
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
        </form>
      </section>
    </main>
  );
}
