"use client";
import Link from "next/link";
import styles from "./page.module.css";
import backgroundStyles from "@/styles/planBackground.module.css";
import { usePlanBackground } from "@/hooks/usePlanBackground";
import { useEffect, useState } from "react";
import axios from "axios";
import { PlanDay } from "@/domain/interface";
import { apiService } from "@/service/ApiService";



export default function PlansPage() {
  const [days, setDays] = useState<PlanDay[]>([]);
  const cardBackgrounds = usePlanBackground();

  useEffect(() => {
    const loadDays = async () => {
      try
      {
        const response = await apiService.apiClient.get("/planDay") 
        
        console.log(response.data);
        setDays(response.data);

      }
      catch(error)
      {
        console.error(error);
      }
    };
    loadDays();
  }, [])

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {days.map((plan, index) => (
          <div className={styles.test} key={plan.id}>
          <Link href={`/habits/addiction/plan/plan${plan.countDay}`} className={`${styles.card} ${backgroundStyles.card}`} style={cardBackgrounds[index]}>
            <div className={styles.titleDiv}><h2 className={styles.title}>{plan.countDay === "Individual" ? "Индивидуал" : `${plan.countDay} дней`}</h2></div>
              {/* <p className={styles.description}>{plan.description}</p> */}
          </Link>
          </div>
        ))}
      </div>
    </main>
  );

}
