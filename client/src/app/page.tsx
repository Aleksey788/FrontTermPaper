import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <figure className={styles.heroQuote}>
          <blockquote className={styles.quote}>«Я просто сгубил себя!»</blockquote>
          <figcaption>— Ф. М. Достоевский</figcaption>
        </figure>

        <div className={styles.heroContent}>
          <span className={styles.badge}>
            Измени привычки — измени жизнь
          </span>
          <h1 className={styles.heroTitle}>
            Избавься от вредных привычек и создай{" "}
            <span>лучшую версию себя</span>
          </h1>
          {/* <p className={styles.heroText}>
            Научно обоснованные методики помогут вам шаг за шагом изменить
            образ жизни, понять причины зависимости и закрепить результат
            навсегда.
          </p> */}
          <div className={styles.heroButtons}>
            <Link href="/habits" className="btn btnPrimary">
              Начать путь к себе →
            </Link>
            <Link href="/contact" className="btn btnSecondary">
              ▶ Узнать больше
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
