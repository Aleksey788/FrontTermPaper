"use client";
import React, { useEffect, useState } from 'react'
import style from './page.module.css'
import axios from 'axios';


interface Plan7 {
  id: number,
  number: number,
  description: string,
  habitNameId: number,
  planDayId: number,
  check: boolean,
  canCheck: boolean
}

export default function Page() {
  const [days, setDays] = useState<Plan7[]>([]);

  useEffect(() => {
    const loadDays = async () => {
      try
      {
        const response = await axios.get("https://localhost:7239/habits/addiction/plan/plan30", {
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
        <h1>Страница о том как бросить употреблять наркотики за 30 дней</h1>
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