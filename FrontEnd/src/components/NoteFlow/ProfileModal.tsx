"use client";

import { useNoteFlowContext } from "./NoteFlowProvider";
import { X } from "lucide-react";
import { FormEvent, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { subscribeUserToPush } from "@/utils/push-notification";
import { Bell, BellOff } from "lucide-react";

export function ProfileModal() {
  const { profileModalOpen, setProfileModalOpen, user, setUser, token, setSaveMessage } = useNoteFlowContext();
  
  const [formData, setFormData] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [pushEnabled, setPushEnabled] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushEnabled(Notification.permission === 'granted');
    }
  }, [profileModalOpen]);

  useEffect(() => {
    if (profileModalOpen && user) {
      setFormData(JSON.parse(JSON.stringify(user)));
      setProfileMessage("");
      setPasswordMessage("");
      setCurrentPassword("");
      setNewPassword("");
    }
  }, [profileModalOpen, user]);

  if (!profileModalOpen || !formData) return null;

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      const response = await api.updateProfile(token, formData);
      setUser(response.user);
      setProfileMessage(response.message || "Đã lưu thông tin tài khoản.");
      setTimeout(() => setProfileMessage(""), 3000);
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : "Không thể cập nhật tài khoản.");
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      const response = await api.changePassword(token, { currentPassword, newPassword });
      setPasswordMessage(response.message || "Đổi mật khẩu thành công.");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPasswordMessage(""), 3000);
    } catch (error) {
      setPasswordMessage(error instanceof Error ? error.message : "Không thể đổi mật khẩu.");
    }
  }

  async function handleTogglePush() {
    if (pushEnabled) {
      // Logic để hủy đăng ký nếu cần, ở đây tạm thời chỉ thông báo
      alert("Để tắt thông báo hoàn toàn, vui lòng chỉnh sửa quyền trong cài đặt trình duyệt của bạn.");
      return;
    }

    setIsSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await subscribeUserToPush();
        setPushEnabled(true);
        setProfileMessage("Đã bật thông báo thành công!");
      } else {
        setProfileMessage("Bạn đã từ chối quyền thông báo.");
      }
    } catch (error) {
      console.error(error);
      setProfileMessage("Lỗi khi đăng ký thông báo.");
    } finally {
      setIsSubscribing(false);
      setTimeout(() => setProfileMessage(""), 3000);
    }
  }

  async function handleSendTestPush() {
    if (!token) return;
    try {
      await api.testPush(token);
      setProfileMessage("Yêu cầu gửi thông báo thử nghiệm đã được gửi!");
    } catch (error) {
      setProfileMessage("Lỗi khi gửi thông báo thử.");
    } finally {
      setTimeout(() => setProfileMessage(""), 3000);
    }
  }

  const preferences = formData.preferences || {};

  return (
    <div className="modal-overlay" onClick={() => setProfileModalOpen(false)} style={{ zIndex: 1200 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 700, width: "90%", padding: 32, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h3 className="modal-title" style={{ fontSize: "1.5rem", marginBottom: 8 }}>Hồ sơ và tuỳ chọn</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Cập nhật thông tin cá nhân và tuỳ chỉnh giao diện làm việc của bạn.</p>
          </div>
          <X 
            size={24} 
            style={{ cursor: "pointer", color: "var(--text-muted)", transition: "color 0.2s" }}
            onMouseOver={(e) => e.currentTarget.style.color = "var(--text)"}
            onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
            onClick={() => setProfileModalOpen(false)} 
          />
        </div>

        {formData.isActive === false && (
          <div style={{ background: "var(--accent-soft)", border: "1px solid var(--border)", color: "var(--accent)", padding: "12px 16px", borderRadius: 8, marginBottom: 24, fontSize: "0.9rem" }}>
            Tài khoản chưa kích hoạt email. Bạn vẫn có thể dùng hệ thống bình thường.
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {/* Cột 1: Thông tin cá nhân */}
          <div>
            <h4 style={{ marginBottom: 16, fontSize: "1.1rem", fontWeight: 600, color: "var(--text)" }}>Thông tin cá nhân</h4>
            <form onSubmit={updateProfile} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>Họ và tên</span>
                <input
                  className="modal-input"
                  value={formData.fullName || ""}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{ padding: "10px 14px" }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>Email</span>
                <input
                  className="modal-input"
                  value={formData.email || ""}
                  readOnly
                  style={{ padding: "10px 14px", background: "var(--bg)", opacity: 0.7 }}
                />
              </label>

              {profileMessage && (
                <div style={{ fontSize: "0.85rem", color: profileMessage.includes("Không thể") ? "#EF4444" : "#10B981" }}>
                  {profileMessage}
                </div>
              )}
              
              <button type="submit" className="primary-button" style={{ marginTop: 8, width: "auto", alignSelf: "flex-start", padding: "10px 20px" }}>
                Lưu thông tin
              </button>
            </form>
          </div>

          {/* Cột 2: Đổi mật khẩu */}
          <div>
            <h4 style={{ marginBottom: 16, fontSize: "1.1rem", fontWeight: 600, color: "var(--text)" }}>Bảo mật</h4>
            <form onSubmit={changePassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>Mật khẩu hiện tại</span>
                <input
                  type="password"
                  className="modal-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ padding: "10px 14px" }}
                  placeholder="Nhập mật khẩu cũ"
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>Mật khẩu mới</span>
                <input
                  type="password"
                  className="modal-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ padding: "10px 14px" }}
                  placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                />
              </label>

              {passwordMessage && (
                <div style={{ fontSize: "0.85rem", color: passwordMessage.includes("Không thể") ? "#EF4444" : "#10B981" }}>
                  {passwordMessage}
                </div>
              )}

              <button type="submit" className="modal-btn confirm" style={{ marginTop: 8, width: "auto", alignSelf: "flex-start", padding: "10px 20px", display: "flex", justifyContent: "center" }}>
                Đổi mật khẩu
              </button>
            </form>
          </div>
        </div>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
          <h4 style={{ marginBottom: 16, fontSize: "1.1rem", fontWeight: 600, color: "var(--text)" }}>Thông báo</h4>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg)", padding: "16px 20px", borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 12, 
                background: pushEnabled ? "rgba(16, 185, 129, 0.1)" : "rgba(107, 114, 128, 0.1)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: pushEnabled ? "#10B981" : "var(--text-muted)"
              }}>
                {pushEnabled ? <Bell size={24} /> : <BellOff size={24} />}
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>Thông báo trình duyệt</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {pushEnabled 
                    ? "Bạn đang nhận thông báo khi có ghi chú mới được chia sẻ hoặc nhắc nhở." 
                    : "Bật để nhận thông báo ngay cả khi ứng dụng đã đóng."}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {pushEnabled && (
                <button 
                  onClick={handleSendTestPush}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  Gửi thử
                </button>
              )}
              <button 
                onClick={handleTogglePush}
                disabled={isSubscribing}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: pushEnabled ? "var(--bg)" : "var(--accent)",
                  color: pushEnabled ? "var(--text)" : "white",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {isSubscribing ? "Đang xử lý..." : (pushEnabled ? "Đã bật" : "Bật thông báo")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
