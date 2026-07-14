import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <h1>Страница о вырывании кожи</h1>
      <Link href="/habits/skin_picking/plan">Перейти к плану</Link>
    </div>
  )
}

export default page 