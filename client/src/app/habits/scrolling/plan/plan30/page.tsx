import PlanDetails from "@/components/PlanDetails";
import style from "./page.module.css";

export default function Page() {
  return (
    <PlanDetails
      habitSlug="scrolling"
      duration="30"
      title="Страница о том как избавиться от зависимости листания ленты за 30 дней"
      daysClassName={style.days}
      dayClassName={style.day}
    />
  );
}
