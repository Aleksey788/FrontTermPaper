// "use client";
// import React, { useEffect, useState } from 'react'
// import style from './page.module.css'
// import axios from 'axios';


// interface Plan7 {
//   id: number,
//   number: number,
//   description: string,
//   habitNameId: number,
//   planDayId: number,
//   check: boolean
// }


// export default function Page() {
//   const [days, setDays] = useState<Plan7[]>([]);

//   const [checkedDays, setCheckedDays] = useState({});
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedDay, setSelectedDay] = useState(null);

//   const [review, setReview] = useState({
//     stars: 5,
//     comment: "",
//   });

//   useEffect(() => {
//     const loadDays = async () => {
//       try
//       {
//         const response = await axios.get("https://localhost:7239/habits/addiction/plan/plan7");

//         console.log(response.data)
//         setDays(response.data)
//       }
//       catch(error)
//       {
//         console.error(error)
//       }
//     }
//     loadDays()
//   }, [])

//   return (
//     <div>
//         <h1>Страница о том как бросить употреблять наркотики за 7 дней</h1>
//         <section className={style.days}>
//           {days.map((item) => (
//             <div key={item.id} className={style.day}>
//               <h3>День {item.number}</h3>
//               <details>
//                 <summary>Подробнее</summary>
//                 <p>{item.description}</p>
//               </details>
//               <input type="checkbox" id="agree" name="agree" />
//               <label htmlFor="agree">Выполнил(а) задание</label>
//             </div>
//           ))}
//         </section>
//     </div>
//   )
// }

"use client";

import React, { useEffect, useState } from "react";
import style from "./page.module.css";
import axios from "axios";

interface Plan7 {
  id: number;
  number: number;
  description: string;
  habitNameId: number;
  planDayId: number;
  check: boolean;
}

export default function Page() {
  const [days, setDays] = useState<Plan7[]>([]);

  const [checkedDays, setCheckedDays] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Plan7 | null>(null);

  const [review, setReview] = useState({
    stars: 5,
    comment: "",
  });

  useEffect(() => {
    const loadDays = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7239/habits/addiction/plan/plan7"
        );

        console.log(response.data);
        setDays(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadDays();
  }, []);

  const handleReview = () => {
    console.log({
      day: selectedDay?.number,
      stars: review.stars,
      comment: review.comment,
    });

    // Здесь потом можно отправить отзыв на сервер

    setIsModalOpen(false);

    setReview({
      stars: 5,
      comment: "",
    });
  };

  return (
    <div>
      <h1>Страница о том как бросить употреблять наркотики за 7 дней</h1>

      <button>Начать план</button>

      <section className={style.days}>
        {days.map((item) => (
          <div key={item.id} className={style.day}>
            <h3>День {item.number}</h3>

            <details>
              <summary>Подробнее</summary>
              <p>{item.description}</p>
            </details>

            <input
              type="checkbox"
              id={`agree-${item.id}`}
              checked={checkedDays[item.id] || false}
              onChange={(e) =>
                setCheckedDays({
                  ...checkedDays,
                  [item.id]: e.target.checked,
                })
              }
            />

            <label htmlFor={`agree-${item.id}`}>
              Выполнил(а) задание
            </label>

            {checkedDays[item.id] && (
              <button
                onClick={() => {
                  setSelectedDay(item);
                  setIsModalOpen(true);
                }}
              >
                Оставить отзыв
              </button>
            )}
          </div>
        ))}
      </section>

      {isModalOpen && selectedDay && (
        <div className={style.overlay}>
          <div className={style.modal}>
            <h2>Отзыв за {selectedDay.number} день</h2>

            <label>Количество звезд</label>

            <div className={style.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    review.stars >= star ? style.activeStar : style.star
                  }
                  onClick={() =>
                    setReview({
                      ...review,
                      stars: star,
                    })
                  }
                >
                  ★
                </span>
              ))}
            </div>

            <label>Комментарий</label>

            <textarea
              placeholder="Напишите отзыв..."
              value={review.comment}
              onChange={(e) =>
                setReview({
                  ...review,
                  comment: e.target.value,
                })
              }
            />

            <div className={style.buttons}>
              <button onClick={handleReview}>
                Отправить
              </button>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setReview({
                    stars: 5,
                    comment: "",
                  });
                }}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}