import React from 'react'
import style from './page.module.css'

const day = [
  {
    day: 1,
    title: 'Понимание зависимости',
    content: "В первый день..."
  },
  {
    day: 2,
    title: 'Признание проблемы',
    content: "Во второй день..."
  },
  {
    day: 3,
    title: 'Постановка целей',
    content: "В третий день..."
  },
  {
    day: 4,
    title: 'Разработка плана действий',
    content: "В четвертый день..."
  },
  {
    day: 5,
    title: 'Поддержка и ресурсы',
    content: "В пятый день..."
  },
  {
    day: 6,
    title: 'Преодоление трудностей',
    content: "В шестой день..."
  },
  {
    day: 7,
    title: 'Закрепление результатов',
    content: "В седьмой день..."
  }
]

const page = () => {
  return (
    <div>
        <h1>Страница о том как избавиться от зависимости играть в видеоигры за 7 дней</h1>
        <section className={style.days}>
          {day.map((item) => (
            <div key={item.day} className={style.day}>
              <h3>День {item.day}: {item.title}</h3>
              <details>
                <summary>Подробнее</summary>
                <p>{item.content}</p>
              </details>
              <input type="checkbox" id="agree" name="agree" />
              <label htmlFor="agree">Выполнил(а) задание</label>
            </div>
          ))}
        </section>
    </div>
  )
}

export default page