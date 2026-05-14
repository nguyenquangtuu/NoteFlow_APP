"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { api } from "@/lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const token = searchParams.get("token") || "";
      const response = await api.resetPassword(token, password);
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể đặt lại mật khẩu.");
    }
  }

  return (
    <AuthShell
      title="Đặt lại mật khẩu"
      description="Nhập mật khẩu mới cho tài khoản của bạn."
      footer={
        <p>
          Quay lại <Link href="/dang-nhap">đăng nhập</Link>
        </p>
      }
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Mật khẩu mới
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
        </label>
        <button className="primary-button" type="submit">
          Cập nhật mật khẩu
        </button>
        {message ? <p className="form-message">{message}</p> : null}
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="auth-page"><section className="auth-panel auth-form-panel">Đang tải...</section></main>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
