import React from 'react'

const page = () => {
  return (
    <div>
        <h1>Админ панель</h1>

        <div>
            <aside>
                <nav>
                    <ul>
                        <li><a href="/admin/statistics">Статистика</a></li>
                        <li><a href='/admin/days'>дни</a></li>
                        <li><a href="/admin/homepage">Главня</a></li>
                        <li><a href="/admin/contacts">Контакты</a></li>
                    </ul>
                </nav>
            </aside>
        </div>
    </div>
  )
}

export default page