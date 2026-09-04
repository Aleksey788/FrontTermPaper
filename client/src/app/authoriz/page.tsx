"use client";

import React, { useState } from "react";
import axios from "axios";

const API = "https://localhost:7239";

type Step = "form" | "code";

const FormAuthorization = () => {
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const showError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message ?? "Ошибка соединения с сервером");
    } else {
      alert("Ошибка");
    }
  };

  // Шаг 1: email + пароль → сервер шлёт код на почту
  const handleLoginStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/authoriz`, {
        Email: email,
        Password: password,
      });

      alert(response.data.message ?? "Код отправлен на почту");
      setStep("code");
      setCode("");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  // Шаг 2: код → вход выполнен
  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/authoriz/confirm`, {
        Email: email,
        Code: code,
      });

      if (response.data.userId != null) {
        localStorage.setItem("userId", String(response.data.userId));
      }

      alert(response.data.message ?? "Авторизация успешна!");
      setStep("form");
      setEmail("");
      setPassword("");
      setCode("");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formCard">
      <h1>Авторизация</h1>

      {step === "form" ? (
        <form onSubmit={handleLoginStart} className="inputs">
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
          />
          <button type="submit" disabled={loading}>
            {loading ? "Отправка..." : "Получить код"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirmCode} className="inputs">
          <p>Код отправлен на {email}</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Код из письма"
            name="Code"
            required
            inputMode="numeric"
            autoComplete="one-time-code"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Проверка..." : "Войти"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setStep("form");
              setCode("");
            }}
          >
            Назад
          </button>
        </form>
      )}
    </div>
  );
};

export default FormAuthorization;
