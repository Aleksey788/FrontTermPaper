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
  },
  {
    day: 8,
    title: 'Продолжение работы над собой',
    content: "В восьмой день..."
  },
  {
    day: 9,
    title: 'Укрепление новых привычек',
    content: "В девятый день..."
  },
  {
    day: 10,
    title: 'Поддержка окружения',
    content: "В десятый день..."
  },
  {
    day: 11,
    title: 'Развитие навыков самоконтроля',
    content: "В одиннадцатый день..."
  },
  {
    day: 12,
    title: "Текст",
    content: "В двенадцатый день..."
  },
  {
    day: 13,
    title: "Текст",
    content: "В тринадцатый день...",

  },
  {
    day: 14,
    title: "Текст",
    content: "Заверщающий день"
  }
]

const page = () => {
  return (
    <div>
        <h1>Страница о том как избавиться от зависимости играть в азартные игры за 14 дней</h1>
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
