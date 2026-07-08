"use client";

import React, { useState } from "react";
import axios from "axios";

const FormRegistr = () => {
  const [form, setForm] = useState({
    Email: "",
    Password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })}

   const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post('https://localhost:7239/register', {
            ...form, 
            Email: (form.Email),
            Password: (form.Password)
        })
        alert("Регистрация успешна!")
        setForm({
          Email: "",
          Password: ""
        })
        }

    return (
      <div>
        <form onSubmit={handleSubmit} className='inputs'>
          <input type="Email" onChange={handleChange} value={form.Email} placeholder='Почта' name="Email"/>
          <input type="Password" onChange={handleChange} value={form.Password} placeholder='Пароль' name="Password"/>
          <button type='submit'>Отправить</button>
        </form>
      </div>
    )
}

export default FormRegistr;