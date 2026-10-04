"use client";

import type { DayContent } from "@/domain/interface";
import styles from "./PlanDayCard.module.css";

interface PlanDayCardProps {
  number: number;
  day?: DayContent;
  checked: boolean;
  daysError: boolean;
  saving?: boolean;
  error?: string;
  onCheck: (dayId: number, checked: boolean) => void;
  onReview: (day: DayContent) => void;
}

export default function PlanDayCard({ number, day, checked, daysError, saving, error, onCheck, onReview }: PlanDayCardProps) {
  return (
    <article className={styles.day}>
      <h2>День {number}</h2>
      {day ? (
        <>
          <details>
            <summary>Подробнее</summary>
            <p>{day.description}</p>
          </details>
          <input
            type="checkbox"
            id={`agree-${day.id}`}
            disabled={!day.canCheck || checked || saving}
            checked={checked}
            onChange={(event) => onCheck(day.id, event.target.checked)}
          />
          <label htmlFor={`agree-${day.id}`}>
            Выполнил(а) задание{!day.canCheck && " (ещё недоступно)"}
          </label>
          {!checked && day.lockReason && <p>{day.lockReason}</p>}
          {saving && <p role="status">Сохранение выполнения...</p>}
          {error && <p role="alert">{error}</p>}
          {checked && (
            <button type="button" onClick={() => onReview(day)}>
              Оставить отзыв
            </button>
          )}
        </>
      ) : (
        <p>{daysError ? "Содержимое дня недоступно." : "Содержимое дня ещё не добавлено."}</p>
      )}
    </article>
  );
}
