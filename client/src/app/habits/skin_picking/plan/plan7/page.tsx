import PlanDetails from "@/components/PlanDetails";
import style from "./page.module.css";

export default function Page() {
  return (
    <PlanDetails
      habitSlug="skin_picking"
      duration="7"
      title="Страница о том как избавиться от привычки вырывать кожу за 7 дней"
      daysClassName={style.days}
      dayClassName={style.day}
    />
  );
}
