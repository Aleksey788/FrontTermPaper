import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <h1>Страница о видеоиграх</h1>
      <Link href="/habits/gaming/plan">Перейти к плану</Link>
    </div>
  )
}

export default page