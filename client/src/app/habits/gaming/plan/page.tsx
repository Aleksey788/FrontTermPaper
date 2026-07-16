"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import axios from "axios";


interface PlanDay {
  id: number;
  countDay: string;
  description: string;
}

export default function PlansPage() {
  const [days, setDays] = useState<PlanDay[]>([]);

  useEffect(() => {
    const loadDays = async () => {
      try
      {
        const response = await axios.get("https://localhost:7239/planDay");
        
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
          <Link href={`/habits/smoking/plan/plan${plan.countDay}`} key={plan.id} className={styles.card}>
              <h2 className={styles.title}>{plan.countDay} дней</h2>
              <p className={styles.description}>{plan.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );

}