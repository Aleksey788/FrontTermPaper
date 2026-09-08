"use client";
import React, { useEffect, useState } from 'react'
import style from './page.module.css'
import { Plan30 } from '@/domain/interface';
import { apiService } from '@/service/ApiService';


export default function Page() {
  const [days, setDays] = useState<Plan30[]>([]);

  useEffect(() => {
    const loadDays = async () => {
      try
      {
        const response = await apiService.apiClient.get("/habits/smoking/plan/plan30", {
          params: (() => {
            const userId = localStorage.getItem("userId");
            return userId ? { userId: Number(userId) } : {};
          })()
        });

        console.log(response.data)
        setDays(response.data)
      }
      catch(error)
      {
        console.error(error)
      }
    }
    loadDays()
  }, [])

  return (
    <div>
        <h1>Страница о том как избавиться от привычки курить за 30 дней</h1>
        <section className={style.days}>
          {days.map((item) => (
            <div key={item.id} className={style.day}>
              <h3>День {item.number}</h3>
              <details>
                <summary>Подробнее</summary>
                <p>{item.description}</p>
              </details>
              <input type="checkbox" id={`agree-${item.id}`} name="agree" disabled={!item.canCheck} />
              <label htmlFor={`agree-${item.id}`}>Выполнил(а) задание{!item.canCheck && " (ещё недоступно)"}</label>
            </div>
          ))}
        </section>
    </div>
  )
}