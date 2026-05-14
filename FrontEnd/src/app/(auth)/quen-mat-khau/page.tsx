"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [demoToken, setDemoToken] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await api.forgotPassword(email);
      setMessage(response.message);
      if (response.resetToken) setDemoToken(response.resetToken);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể gửi yêu cầu.");
    }
  }

  return (
    <AuthShell
      title="Quên mật khẩu"
      description="Nhập email đã đăng ký, hệ thống sẽ gửi liên kết đặt lại mật khẩu."
      footer={
        <p>
          Quay lại <Link href="/dang-nhap">đăng nhập</Link>
        </p>
      }
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <button className="primary-button" type="submit">
          Gửi email đặt lại
        </button>
        {message ? <p className="form-message">{message}</p> : null}
        {demoToken && (
          <p className="form-message" style={{ background: "var(--bg-muted)", padding: "10px", borderRadius: "8px", marginTop: "10px" }}>
            <span style={{ display: "block", marginBottom: "4px", fontSize: "0.8rem", opacity: 0.7 }}>Demo Mode:</span>
            <Link 
              href={`/dat-lai-mat-khau?token=${demoToken}`} 
              style={{ color: "var(--primary)", fontWeight: "bold", textDecoration: "underline" }}
            >
              Nhấn vào đây để đặt lại mật khẩu ngay
            </Link>
          </p>
        )}
      </form>
    </AuthShell>
  );
}
