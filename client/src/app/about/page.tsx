import React from 'react'
import style from './page.module.css'

const page = () => {
  return (
    <div>
      <h1>Страница о нас</h1>

       <div className={style.contacts__content}>

            <section className={style.contacts__info}>

                <h1>
                    <span>Have questions?</span>
                    Get in touch in any way that's convenient for you
                </h1>

                <p className={style['working-hours']} >
                    9:00 AM – 6:00 PM (Moscow Time, UTC+3)
                </p>

                <nav className={style.messengers}>
                    <a href="#">Telegram</a>
                    <a href="#">WhatsApp</a>
                </nav>

            </section>

            <aside className={style.contacts__details}>

                <section className={style['contact-block']}>
                    <h2>Phone</h2>
                    <a href="tel:+79967386271">
                        +7 (996) 738-62-71
                    </a>
                </section>

                <section className={style['contact-block']}>
                    <h2>Email</h2>
                    <a href="mailto:info@sunmanure.com">
                        info@sunmanure.com
                    </a>
                </section>


            </aside>

        </div>
    </div>
  )
}

export default page