"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { api } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const activationToken = searchParams.get("kich-hoat");
    if (!activationToken) return;
    api.activate(activationToken)
      .then((response) => setMessage(response.message))
      .catch((error) => setMessage(error.message));
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await api.login({ email, password });
      window.localStorage.setItem("noteflow_token", response.token);
      router.push("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Đăng nhập thất bại.");
    }
  }

  return (
    <AuthShell
      title="Đăng nhập"
      description="Truy cập không gian ghi chú theo lịch, lưu ý tưởng và công việc mỗi ngày."
      footer={
        <p>
          Chưa có tài khoản? <Link href="/dang-ky">Đăng ký ngay</Link>
        </p>
      }
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label>
          Mật khẩu
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
        </label>
        <button className="primary-button" type="submit">
          Đăng nhập
        </button>
        <Link href="/quen-mat-khau" className="ghost-link">
          Quên mật khẩu?
        </Link>
        {message ? <p className="form-message">{message}</p> : null}
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="auth-page"><section className="auth-panel auth-form-panel">Đang tải...</section></main>}>
      <LoginForm />
    </Suspense>
  );
}
