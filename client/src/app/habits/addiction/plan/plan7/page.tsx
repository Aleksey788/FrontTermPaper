import PlanDetails from "@/components/PlanDetails";
import style from "./page.module.css";

export default function Page() {
  return (
    <PlanDetails
      habitSlug="addiction"
      duration="7"
      title="Страница о том как бросить употреблять наркотики за 7 дней"
      daysClassName={style.days}
      dayClassName={style.day}
      reviewClasses={{
        overlay: style.overlay,
        modal: style.modal,
        stars: style.stars,
        star: style.star,
        activeStar: style.activeStar,
        buttons: style.buttons,
      }}
    />
  );
}
