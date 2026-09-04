import React from "react";
import Link from "next/link";
import adminStyles from "@/styles/admin.module.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className={adminStyles.layout}>
      <aside className={adminStyles.sidebar}>
        <h2>Админ-панель</h2>
        <nav>
          <ul>
            <li>
              <Link href="/admin/statistics">Статистика</Link>
            </li>
            <li>
              <Link href="/admin/days">Дни</Link>
            </li>
            <li>
              <Link href="/admin/homepage">Главная</Link>
            </li>
            <li>
              <Link href="/admin/contacts">Контакты</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <div className={adminStyles.content}>{children}</div>
    </div>
  );
}
