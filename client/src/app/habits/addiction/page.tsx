import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <h1>Страница о зависимости накротиков</h1>
      <Link href="/habits/addiction/plan">Перейти к плану</Link>
    </div>
  )
}

export default page