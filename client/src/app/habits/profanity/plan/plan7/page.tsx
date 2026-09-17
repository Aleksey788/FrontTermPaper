import PlanDetails from "@/components/PlanDetails";
import style from "./page.module.css";

export default function Page() {
  return (
    <PlanDetails
      habitSlug="profanity"
      duration="7"
      title="Страница о том как избавиться от зависимости ругаться матом за 7 дней"
      daysClassName={style.days}
      dayClassName={style.day}
    />
  );
}
