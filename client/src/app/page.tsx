import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
       <h1>Хеллоу Мир!</h1>

<header>
    <nav>
        <a>Главная</a>
        <a>О программе</a>
        <a>Как это работает</a>
        <a>Привычки</a>
        <a>Блог</a>
        <a>Контакты</a>
    </nav>
</header>

    <section>
        <span>Измени привычки — измени жизнь</span>
        <h1>Избавься от вредных привычек...</h1>
        <p>Научно обоснованные методики...</p>
        <button>Начать путь к себе</button>
        <a>Узнать больше</a>

        <aside>
            <h2>Панель управления</h2>
            <h3>Текущий прогресс</h3>
            <span>68%</span>
            <p>Ты на правильном пути!</p>
        </aside>
    </section>

    <section>
        <h2>Мы помогаем вам</h2>

        <article>
            <h3>Определить привычки</h3>
            <p>Выявите вредные привычки...</p>
        </article>

        <article>
            <h3>Понять причины</h3>
            <p>Глубокий анализ поможет...</p>
        </article>

        <article>
            <h3>Изменить мышление</h3>
            <p>Проверенные методики...</p>
        </article>

        <article>
            <h3>Закрепить результат</h3>
            <p>Система поддержки...</p>
        </article>
    </section>

    <section>
    </section>



    </div>
  );
}
