"use client";

import React, { useRef, useState } from "react";
import axios from "axios";
import { apiService } from "@/service/ApiService";
import styles from "./AuthForm.module.css";

type Mode = "login" | "signup";
type Step = "form" | "code";

export default function AuthForm({ initialMode }: { initialMode: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [registrationPassword, setRegistrationPassword] = useState("");
  const loginTab = useRef<HTMLButtonElement>(null);
  const signupTab = useRef<HTMLButtonElement>(null);
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
      const response = await apiService.apiClient.post('/authoriz', {
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
      const response = await apiService.apiClient.post('/authoriz/confirm', {
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.apiClient.post('/register', {
        Email: registrationEmail,
        Password: registrationPassword,
      });

      alert(response.data.message ?? "Регистрация успешна!");
      setRegistrationEmail("");
      setRegistrationPassword("");
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

  const isSignup = mode === "signup";
  const isCodeStep = !isSignup && step === "code";

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (loading) return;
    let nextMode: Mode;
    if (event.key === "Home") nextMode = "login";
    else if (event.key === "End") nextMode = "signup";
    else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      nextMode = isSignup ? "login" : "signup";
    } else return;
    event.preventDefault();
    setMode(nextMode);
    (nextMode === "login" ? loginTab : signupTab).current?.focus();
  };

  return (
    <div className={`formCard ${styles.card}`}>
      <div className={styles.tabs} data-mode={mode} role="tablist" aria-label="Вход или регистрация">
        <button
          ref={loginTab}
          id="login-tab"
          type="button"
          role="tab"
          aria-selected={!isSignup}
          aria-controls="auth-panel"
          tabIndex={isSignup ? -1 : 0}
          className={styles.tab}
          disabled={loading}
          onClick={() => setMode("login")}
          onKeyDown={handleTabKeyDown}
        >
          LOG IN
        </button>
        <button
          ref={signupTab}
          id="signup-tab"
          type="button"
          role="tab"
          aria-selected={isSignup}
          aria-controls="auth-panel"
          tabIndex={isSignup ? 0 : -1}
          className={styles.tab}
          disabled={loading}
          onClick={() => setMode("signup")}
          onKeyDown={handleTabKeyDown}
        >
          SIGN UP
        </button>
      </div>

      <div
        key={`${mode}-${isCodeStep}`}
        id="auth-panel"
        role="tabpanel"
        aria-labelledby={isSignup ? "signup-tab" : "login-tab"}
        aria-busy={loading}
        className={styles.panel}
      >
        <h1>{isSignup ? "Регистрация" : "Авторизация"}</h1>
        {isCodeStep ? (
          <form onSubmit={handleConfirmCode} className="inputs">
            <p>Код отправлен на {email}</p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Код из письма"
              aria-label="Код из письма"
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
        ) : (
          <form onSubmit={isSignup ? handleRegister : handleLoginStart} className="inputs">
            <input
              type="email"
              value={isSignup ? registrationEmail : email}
              onChange={(e) => (isSignup ? setRegistrationEmail : setEmail)(e.target.value)}
              placeholder="Почта"
              aria-label="Почта"
              name="Email"
              required
            />
            <input
              type="password"
              value={isSignup ? registrationPassword : password}
              onChange={(e) => (isSignup ? setRegistrationPassword : setPassword)(e.target.value)}
              placeholder="Пароль"
              aria-label="Пароль"
              name="Password"
              required
              minLength={isSignup ? 6 : undefined}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Отправка..." : isSignup ? "Зарегистрироваться" : "Получить код"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
