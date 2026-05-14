"use client";

import Link from "next/link";
<<<<<<< HEAD
import { useRouter } from "next/navigation";
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { api } from "@/lib/api";

export default function RegisterPage() {
<<<<<<< HEAD
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
=======
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
<<<<<<< HEAD
      const response = await api.register({ fullName, email, password, confirmPassword });
      window.localStorage.setItem("noteflow_token", response.token);
      setMessage(response.message);
      router.push("/");
=======
      const response = await api.register({ fullName, email, password });
      setMessage(`${response.message} Token demo: ${response.activationToken || "Đã gửi email"}`);
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Đăng ký thất bại.");
    }
  }

  return (
    <AuthShell
      title="Tạo tài khoản"
      description="Đăng ký qua email để đồng bộ ghi chú, nhãn và lịch công việc của bạn."
      footer={
        <p>
          Đã có tài khoản? <Link href="/dang-nhap">Đăng nhập</Link>
        </p>
      }
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Họ và tên
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        </label>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label>
          Mật khẩu
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
        </label>
<<<<<<< HEAD
        <label>
          Xác nhận mật khẩu
          <input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" required />
        </label>
=======
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
        <button className="primary-button" type="submit">
          Đăng ký
        </button>
        {message ? <p className="form-message">{message}</p> : null}
      </form>
    </AuthShell>
  );
}
