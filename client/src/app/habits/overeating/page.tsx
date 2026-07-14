import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <h1>Страница о переедании</h1>
      <Link href="/habits/overeating/plan">Перейти к плану</Link>
    </div>
  )
}

export default page