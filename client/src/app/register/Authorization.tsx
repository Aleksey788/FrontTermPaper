"use client";

import React, { useState } from "react";
import axios from "axios";

const FormAuthorization = () => {
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

    try {
        const response = await axios.post(
            "https://localhost:7239/authoriz",
            {
                Email: form.Email,
                Password: form.Password,
            }
        );

        alert(response.data.message ?? "Авторизация успешна!");

        setForm({
            Email: "",
            Password: "",
        });
    } 
    catch (error) 
    {
        if (axios.isAxiosError(error)) 
            alert(error.response?.data.message ?? "Ошибка соединения с сервером");
        else 
            alert("Ошибка");
    }
};

return (
    <div>
        <h1>Страница авторизации</h1>
        <form onSubmit={handleSubmit} className='inputs'>
          <input type="Email" onChange={handleChange} value={form.Email} placeholder='Почта' name="Email"/>
          <input type="Password" onChange={handleChange} value={form.Password} placeholder='Пароль' name="Password"/>
          <button type='submit'>Отправить</button>
        </form>
    </div>
)
}
export default FormAuthorization;