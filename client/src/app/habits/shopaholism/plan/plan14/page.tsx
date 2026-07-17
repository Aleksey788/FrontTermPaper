"use client";
import React, { useEffect, useState } from 'react'
import style from './page.module.css'
import axios from 'axios';


interface Plan14 {
  id: number,
  number: number,
  description: string,
  habitNameId: number,
  planDayId: number,
  check: boolean
}

export default function Page() {
  const [days, setDays] = useState<Plan14[]>([]);

  useEffect(() => {
    const loadDays = async () => {
      try
      {
        const response = await axios.get("https://localhost:7239/habits/shopaholism/plan/plan14");

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
        <h1>Страница о том как избавиться от зависимости инпульсивных покупок за 14 дней</h1>
        <section className={style.days}>
          {days.map((item) => (
            <div key={item.id} className={style.day}>
              <h3>День {item.number}</h3>
              <details>
                <summary>Подробнее</summary>
                <p>{item.description}</p>
              </details>
              <input type="checkbox" id="agree" name="agree" />
              <label htmlFor="agree">Выполнил(а) задание</label>
            </div>
          ))}
        </section>
    </div>
  )
}