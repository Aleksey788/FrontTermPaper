import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Новая Я",
  description: "Свобода от привычек — научно обоснованные методики",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className={styles.header}>
          <Link href="/" className={styles.logo}>
            <img src="/globe.svg" alt="Logo" width={48} height={48} />
            <div className={styles.logoText}>
              <h4>Новая Я</h4>
              <p>Свобода от привычек</p>
            </div>
          </Link>

          <nav className={styles.nav}>
            <Link href="/">Главная</Link>
            <Link href="/contact">Контакты</Link>
            <Link href="/register">Регистрация</Link>
            <Link href="/authoriz">Авторизация</Link>
            <Link href="/habits">Привычки</Link>
          </nav>
        </header>

        <main>{children}</main>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <h3>Новая Я</h3>
              <p>
                Помогаем избавиться от вредных привычек и создать лучшую
                версию себя с помощью научно обоснованных методик.
              </p>
            </div>

            <div className={styles.footerNav}>
              <h4>Навигация</h4>
              <ul>
                <li>
                  <Link href="/">Главная</Link>
                </li>
                <li>
                  <Link href="/habits">Привычки</Link>
                </li>
                <li>
                  <Link href="/contact">Контакты</Link>
                </li>
                <li>
                  <Link href="/register">Регистрация</Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerContact}>
              <h4>Контакты</h4>
              <p>
                <a href="tel:+79967386271">+7 (996) 738-62-71</a>
              </p>
              <p>
                <a href="mailto:info@novayya.ru">info@novayya.ru</a>
              </p>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© 2024 Новая Я. Все права защищены.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
