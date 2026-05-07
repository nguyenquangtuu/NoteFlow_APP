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
    <main className="auth-page">
      <section className="auth-panel auth-hero">
        <div className="brand-badge">NoteFlow</div>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="hero-points">
          <span>Đăng ký và kích hoạt qua email</span>
          <span>Quản lý ghi chú theo ngày</span>
          <span>Giao diện trắng và xanh tím</span>
        </div>
        <Link className="ghost-link" href="/">
          Xem giao diện dashboard
        </Link>
      </section>
      <section className="auth-panel auth-form-panel">
        {children}
        {footer ? <div className="auth-footer">{footer}</div> : null}
      </section>
    </main>
  );
}
