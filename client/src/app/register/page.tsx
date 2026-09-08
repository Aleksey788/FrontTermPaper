"use client";

import React, { useState } from "react";
import axios from "axios";
import { apiService } from "@/service/ApiService";


const FormRegistr = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.apiClient.post('/register', {
        Email: email,
        Password: password,
      });

      alert(response.data.message ?? "Регистрация успешна!");
      setEmail("");
      setPassword("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message ?? "Ошибка соединения с сервером");
      } else {
        alert("Неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formCard">
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit} className="inputs">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Почта"
          name="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          name="Password"
          required
          minLength={6}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Отправка..." : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
};

export default FormRegistr;
