import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <figure className={styles.heroQuote}>
          <blockquote>«Я просто сгубил себя!»</blockquote>
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
          <p className={styles.heroText}>
            Научно обоснованные методики помогут вам шаг за шагом изменить
            образ жизни, понять причины зависимости и закрепить результат
            навсегда.
          </p>
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

      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Мы помогаем вам</h2>
        <div className={styles.featuresGrid}>
          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <h3>Определить привычки</h3>
            <p>
              Выявите вредные привычки, которые мешают вам жить полной
              жизнью, и осознайте их влияние на ваше здоровье.
            </p>
          </article>

          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>🌿</div>
            <h3>Понять причины</h3>
            <p>
              Глубокий анализ поможет понять, почему возникла зависимость
              и что её поддерживает.
            </p>
          </article>

          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>🧠</div>
            <h3>Изменить мышление</h3>
            <p>
              Проверенные методики когнитивно-поведенческой терапии помогут
              изменить паттерны мышления.
            </p>
          </article>

          <article className={styles.featureCard}>
            <div className={styles.featureIcon}>📈</div>
            <h3>Закрепить результат</h3>
            <p>
              Система поддержки и ежедневные задания помогут закрепить
              новые полезные привычки навсегда.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
