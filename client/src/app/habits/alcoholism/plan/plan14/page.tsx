import PlanDetails from "@/components/PlanDetails";
import style from "./page.module.css";

export default function Page() {
  return (
    <PlanDetails
      habitSlug="alcoholism"
      duration="14"
      title="Страница о том как бросить употреблять алкоголь за 14 дней"
      daysClassName={style.days}
      dayClassName={style.day}
    />
  );
}
