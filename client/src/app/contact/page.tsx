import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

const ContactPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <section className={styles.info}>
          <h1>
            <span>Есть вопросы?</span>
            Свяжитесь с нами любым удобным для вас способом
          </h1>

          <p className={styles.workingHours}>
            9:00 – 18:00 (Московское время, UTC+3)
          </p>

          <nav className={styles.messengers}>
            <a href="#" className={styles.telegram}>
              Telegram
            </a>
            <a href="#" className={styles.whatsapp}>
              WhatsApp
            </a>
          </nav>
        </section>

        <aside className={styles.details}>
          <section className={styles.contactBlock}>
            <h2>Телефон</h2>
            <a href="tel:+79967386271">+7 (996) 738-62-71</a>
          </section>

          <section className={styles.contactBlock}>
            <h2>Email</h2>
            <a href="mailto:info@novayya.ru">info@novayya.ru</a>
          </section>

          <section className={styles.navBlock}>
            <h2>Навигация</h2>
            <nav className={styles.navLinks}>
              <Link href="/">Главная</Link>
              <Link href="/habits">Привычки</Link>
              <Link href="/contact">Контакты</Link>
              <Link href="/register">Регистрация</Link>
              <Link href="/authoriz">Авторизация</Link>
            </nav>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ContactPage;
