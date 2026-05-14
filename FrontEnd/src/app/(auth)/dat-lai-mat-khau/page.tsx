"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { api } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get("token");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setMessage("Liên kết không hợp lệ hoặc đã hết hạn.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await api.resetPassword(token, password);
      setMessage(response.message);
      setIsSuccess(true);
      setTimeout(() => router.push("/dang-nhap"), 3000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể đặt lại mật khẩu.");
    }
  }

  if (!token) {
    return (
      <AuthShell
        title="Lỗi"
        description="Không tìm thấy mã xác thực để đặt lại mật khẩu."
        footer={<Link href="/dang-nhap">Quay lại đăng nhập</Link>}
      >
        <p className="form-message">Vui lòng kiểm tra lại liên kết trong email của bạn.</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Đặt lại mật khẩu"
      description="Tạo mật khẩu mới cho tài khoản của bạn."
      footer={
        <p>
          Quay lại <Link href="/dang-nhap">đăng nhập</Link>
        </p>
      }
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Mật khẩu mới
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            required
            minLength={6}
          />
        </label>
        <label>
          Xác nhận mật khẩu mới
          <input
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            type="password"
            required
          />
        </label>
        <button className="primary-button" type="submit" disabled={isSuccess}>
          {isSuccess ? "Đã đặt lại mật khẩu" : "Cập nhật mật khẩu"}
        </button>
        {message ? (
          <p className={`form-message ${isSuccess ? "success" : ""}`} style={isSuccess ? { color: "var(--success)" } : {}}>
            {message}
          </p>
        ) : null}
        {isSuccess && (
          <p style={{ fontSize: "0.85rem", textAlign: "center", marginTop: 8, color: "var(--text-muted)" }}>
            Đang chuyển hướng về trang đăng nhập...
          </p>
        )}
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
