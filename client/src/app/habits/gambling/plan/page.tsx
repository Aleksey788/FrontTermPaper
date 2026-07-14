import Link from "next/link";
import styles from "./page.module.css";

const plans = [
  {
    days: 7,
    description: "Быстрый старт и первые результаты за неделю.",
  },
  {
    days: 14,
    description: "Закрепление привычек и постепенное увеличение нагрузки.",
  },
  {
    days: 30,
    description: "Полный курс для достижения стабильного результата.",
  },
  {
    days: "Individual",
    description: "Создай свой индивидуальный план, учитывая свои особенности и цели",
  }
];


export default function PlansPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {plans.map((plan) => (
          <Link href={`/habits/gambling/plan/plan${plan.days}`} key={plan.days} className={styles.card}>
              <h2 className={styles.title}>{plan.days} дней</h2>
              <p className={styles.description}>{plan.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}