"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { PlanDay } from "@/domain/interface";
import { apiService } from "@/service/ApiService";



export default function PlansPage() {
  const [days, setDays] = useState<PlanDay[]>([]);

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
        {days.map((plan) => (
          <div className={styles.test}>
          <Link href={`/habits/addiction/plan/plan${plan.countDay}`} key={plan.id} className={styles.card}>
            <div className={styles.titleDiv}><h2 className={styles.title}>{plan.countDay}{plan.countDay !== "Individual" && " дней"}</h2></div>
              {/* <p className={styles.description}>{plan.description}</p> */}
          </Link>
          </div>
        ))}
      </div>
    </main>
  );

}
