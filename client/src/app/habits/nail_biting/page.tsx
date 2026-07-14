import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <h1>Страница о грызении ногтей</h1>
      <Link href="/habits/nail_biting/plan">Перейти к плану</Link>
    </div>
  )
}

export default page