import Link from "next/link";
import type { CSSProperties } from "react";
import type { PlanDay } from "@/domain/interface";
import styles from "./PlanSelection.module.css";
import backgroundStyles from "@/styles/planBackground.module.css";

type PlanSelectionProps = {
  slug: string;
  days: PlanDay[];
  cardBackgrounds: CSSProperties[];
};

export default function PlanSelection({ slug, days, cardBackgrounds }: PlanSelectionProps) {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {days.map((plan, index) => (
          <div className={styles.test} key={plan.id}>
            <Link
              href={`/habits/${slug}/plan/plan${plan.countDay}`}
              className={`${styles.card} ${backgroundStyles.card}`}
              style={cardBackgrounds[index]}
            >
              <div className={styles.titleDiv}>
                <h2 className={styles.title}>
                  {plan.countDay === "Individual" ? "Индивидуал" : `${plan.countDay} дней`}
                </h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
