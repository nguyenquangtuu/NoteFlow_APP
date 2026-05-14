import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
<<<<<<< HEAD
    <main className="auth-page" suppressHydrationWarning>
      <section className="auth-panel auth-hero" suppressHydrationWarning>
=======
    <main className="auth-page">
      <section className="auth-panel auth-hero">
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
        <div className="brand-badge">NoteFlow</div>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="hero-points">
          <span>Đăng ký và kích hoạt qua email</span>
          <span>Quản lý ghi chú theo ngày</span>
<<<<<<< HEAD
          <span>Giao diện hiện đại và tối giản</span>
=======
          <span>Giao diện trắng và xanh tím</span>
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
        </div>
        <Link className="ghost-link" href="/">
          Xem giao diện dashboard
        </Link>
      </section>
<<<<<<< HEAD
      <section className="auth-panel auth-form-panel" suppressHydrationWarning>
=======
      <section className="auth-panel auth-form-panel">
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
        {children}
        {footer ? <div className="auth-footer">{footer}</div> : null}
      </section>
    </main>
  );
}
