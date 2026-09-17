import PlanDetails from "@/components/PlanDetails";
import style from "./page.module.css";

export default function Page() {
  return (
    <PlanDetails
      habitSlug="addiction"
      duration="30"
      title="Страница о том как бросить употреблять наркотики за 30 дней"
      daysClassName={style.days}
      dayClassName={style.day}
    />
  );
}
