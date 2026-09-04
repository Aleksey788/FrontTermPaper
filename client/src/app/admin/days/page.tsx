"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/AdminLayout";
import style from "@/styles/admin.module.css";

const API = "https://localhost:7239";

interface Habit {
  id: number;
  name: string;
  slug: string;
}

interface PlanDay {
  id: number;
  countDay: string;
  description: string;
}

interface DayItem {
  id: number;
  number: number;
  description: string;
  habitNameId: number;
  planDayId: number;
}

const Page = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [plans, setPlans] = useState<PlanDay[]>([]);

  const [choiceHabit, setChoiceHabit] = useState("");
  const [choicePlan, setChoicePlan] = useState("");

  const [days, setDays] = useState<DayItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Какой день редактируем + поля формы
  const [editDayId, setEditDayId] = useState("");
  const [editNumber, setEditNumber] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [habitsRes, plansRes] = await Promise.all([
          axios.get(`${API}/habits`),
          axios.get(`${API}/planDay`),
        ]);
        setHabits(habitsRes.data);
        setPlans(plansRes.data);
      } catch (error) {
        console.error(error);
        alert("Не удалось загрузить список привычек и планов");
      }
    };

    loadFilters();
  }, []);

  // При выборе дня в нижнем фильтре — подставляем данные в поля
  useEffect(() => {
    if (!editDayId) {
      setEditNumber("");
      setEditDescription("");
      return;
    }

    const day = days.find((d) => d.id === Number(editDayId));
    if (!day) return;

    setEditNumber(String(day.number));
    setEditDescription(day.description ?? "");
  }, [editDayId, days]);

  const handleSubmit = async () => {
    if (!choiceHabit || !choicePlan) {
      alert("Пожалуйста, выберите привычку и план");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API}/admin/days`, {
        params: {
          habitNameId: Number(choiceHabit),
          planDayId: Number(choicePlan),
        },
      });

      setDays(response.data);
      setLoaded(true);
      setEditDayId("");
      setEditNumber("");
      setEditDescription("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message ?? "Ошибка загрузки дней");
      } else {
        alert("Ошибка загрузки дней");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editDayId) {
      alert("Выберите день для редактирования");
      return;
    }

    const number = Number(editNumber);
    if (!number || number < 1) {
      alert("Укажите корректный номер дня");
      return;
    }

    if (!editDescription.trim()) {
      alert("Описание не может быть пустым");
      return;
    }

    setSaving(true);
    try {
      const response = await axios.put(`${API}/admin/days/${editDayId}`, {
        Number: number,
        Description: editDescription.trim(),
      });

      const updated = response.data as DayItem;

      setDays((prev) =>
        prev
          .map((d) =>
            d.id === updated.id
              ? {
                  ...d,
                  number: updated.number,
                  description: updated.description,
                }
              : d
          )
          .sort((a, b) => a.number - b.number)
      );

      alert(response.data.message ?? "День сохранён");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message ?? "Ошибка сохранения");
      } else {
        alert("Ошибка сохранения");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <h1>Страница редактирования дней</h1>

      <div className={style.choices}>
        <label>
          Привычка
          <select
            value={choiceHabit}
            onChange={(e) => setChoiceHabit(e.target.value)}
          >
            <option value="">Выберите привычку</option>
            {habits.map((habit) => (
              <option key={habit.id} value={habit.id}>
                {habit.name}
            
              </option>
            ))}
          </select>
        </label>

        <label>
          План
          <select
            value={choicePlan}
            onChange={(e) => setChoicePlan(e.target.value)}
          >
            <option value="">Выберите план</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.countDay} дней
              </option>
            ))}
          </select>
        </label>

        <button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Загрузка..." : "Выбрать"}
        </button>
      </div>

      {loaded && (
        <>
          <h2>Дни выбранного плана</h2>

          {days.length === 0 ? (
            <p>Для этой привычки и плана дней пока нет.</p>
          ) : (
            <section className={style.days}>
              {days.map((item) => (
                <div key={item.id} className={style.day}>
                  <h3>День {item.number}</h3>
                  <details>
                    <summary>Подробнее</summary>
                    <p>{item.description}</p>
                  </details>
                </div>
              ))}
            </section>
          )}

          <div className={style.editBlock}>
            <h2>Редактирование дня</h2>

            <label>
              Выберите день
              <select
                value={editDayId}
                onChange={(e) => setEditDayId(e.target.value)}
              >
                <option value="">Выберите день</option>
                {days.map((day) => (
                  <option key={day.id} value={day.id}>
                    День {day.number}
                  </option>
                ))}
              </select>
            </label>

            {editDayId && (
              <form className={style.editForm} onSubmit={handleSaveDay}>
                <label>
                  Номер дня
                  <input
                    type="number"
                    min={1}
                    value={editNumber}
                    onChange={(e) => setEditNumber(e.target.value)}
                    required
                  />
                </label>

                <label>
                  Описание
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    required
                    rows={6}
                  />
                </label>

                <button type="submit" disabled={saving}>
                  {saving ? "Сохранение..." : "Сохранить"}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Page;
