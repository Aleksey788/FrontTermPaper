import PlanDetails from "@/components/PlanDetails";
import style from "./page.module.css";

export default function Page() {
  return (
    <PlanDetails
      habitSlug="scrolling"
      duration="14"
      title="Страница о том как избавиться от зависимости листания ленты за 14 дней"
      daysClassName={style.days}
      dayClassName={style.day}
    />
  );
}
