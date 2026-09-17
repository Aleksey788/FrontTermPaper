"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { DayContent, Habit, PlanDay } from "@/domain/interface";
import { getDayNumbers, selectHabitAndPlan } from "@/domain/planSelection";
import { apiService } from "@/service/ApiService";

type PlanState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "not-found"; message: string }
  | {
      kind: "ready";
      habit: Habit;
      plan: PlanDay;
      days: DayContent[];
      daysError: string | null;
    };

interface ReviewClasses {
  overlay: string;
  modal: string;
  stars: string;
  star: string;
  activeStar: string;
  buttons: string;
}

interface PlanDetailsProps {
  habitSlug: string;
  duration: string;
  title: string;
  daysClassName: string;
  dayClassName: string;
  reviewClasses?: ReviewClasses;
}

interface StartPlanResponse {
  message: string;
  id: number;
  startDate: string;
}

function getUserId(): number | null {
  const stored = localStorage.getItem("userId");
  if (stored === null) return null;

  const id = Number(stored);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function getRequestError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: unknown } | undefined)?.message;
    if (typeof message === "string") return message;
    if (error.response) return `HTTP ${error.response.status}`;
  }
  return error instanceof Error ? error.message : "Неизвестная ошибка";
}

export default function PlanDetails({
  habitSlug,
  duration,
  title,
  daysClassName,
  dayClassName,
  reviewClasses,
}: PlanDetailsProps) {
  const [state, setState] = useState<PlanState>({ kind: "loading" });
  const [reloadVersion, setReloadVersion] = useState(0);
  const [starting, setStarting] = useState(false);
  const [startMessage, setStartMessage] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [checkedDays, setCheckedDays] = useState<Record<number, boolean>>({});
  const [selectedDay, setSelectedDay] = useState<DayContent | null>(null);
  const [review, setReview] = useState({ stars: 5, comment: "" });

  useEffect(() => {
    let cancelled = false;

    async function loadPlan() {
      try {
        const [habitsResponse, plansResponse] = await Promise.all([
          apiService.apiClient.get<Habit[]>("/habits"),
          apiService.apiClient.get<PlanDay[]>("/planDay"),
        ]);
        if (cancelled) return;

        if (!Array.isArray(habitsResponse.data) || !Array.isArray(plansResponse.data)) {
          throw new Error("API вернул неверный формат каталога планов");
        }

        const { habit, plan } = selectHabitAndPlan(
          habitsResponse.data,
          plansResponse.data,
          habitSlug,
          duration,
        );
        if (!habit || !plan) {
          setState({
            kind: "not-found",
            message: !habit ? "Привычка не найдена" : `План на ${duration} дней не найден`,
          });
          return;
        }

        const userId = getUserId();
        try {
          const daysResponse = await apiService.apiClient.get<DayContent[]>(
            `/habits/${habit.slug}/plan/plan${plan.countDay}`,
            { params: userId === null ? {} : { userId } },
          );
          if (cancelled) return;
          if (!Array.isArray(daysResponse.data)) {
            throw new Error("API вернул неверный формат списка дней");
          }
          setState({
            kind: "ready",
            habit,
            plan,
            days: daysResponse.data,
            daysError: null,
          });
        } catch (error) {
          if (!cancelled) {
            setState({
              kind: "ready",
              habit,
              plan,
              days: [],
              daysError: getRequestError(error),
            });
          }
        }
      } catch (error) {
        if (!cancelled) {
          setState({ kind: "error", message: getRequestError(error) });
        }
      }
    }

    void loadPlan();
    return () => {
      cancelled = true;
    };
  }, [habitSlug, duration, reloadVersion]);

  async function handleStartPlan() {
    if (state.kind !== "ready") return;

    const userId = getUserId();
    if (userId === null) {
      setStartError("Для начала плана войдите в аккаунт.");
      return;
    }

    setStarting(true);
    setStartError(null);
    setStartMessage(null);
    try {
      const response = await apiService.apiClient.post<StartPlanResponse>("/startPlan", {
        userId,
        habitNameId: state.habit.id,
        planDayId: state.plan.id,
        startDate: new Date().toISOString(),
      });
      setStartMessage(response.data.message);
      setReloadVersion((version) => version + 1);
    } catch (error) {
      setStartError(`Не удалось начать план: ${getRequestError(error)}`);
    } finally {
      setStarting(false);
    }
  }

  const dayNumbers = state.kind === "ready" ? getDayNumbers(state.plan.countDay) : [];
  const validDayCount = dayNumbers.length > 0;
  const daysByNumber = new Map(
    state.kind === "ready" ? state.days.map((day) => [day.number, day]) : [],
  );

  return (
    <div>
      <h1>{title}</h1>

      {state.kind === "loading" && <p>Загрузка плана...</p>}
      {state.kind === "error" && <p role="alert">Не удалось загрузить план: {state.message}</p>}
      {state.kind === "not-found" && <p role="alert">{state.message}</p>}

      {state.kind === "ready" && (
        <>
          <p>План на {state.plan.countDay} дней</p>
          {!validDayCount && <p role="alert">У плана неверная длительность: {state.plan.countDay}</p>}
          <button type="button" onClick={handleStartPlan} disabled={starting || !validDayCount}>
            {starting ? "Запуск плана..." : "Начать план"}
          </button>
          {startMessage && <p role="status">{startMessage}</p>}
          {startError && <p role="alert">{startError}</p>}

          {state.daysError ? (
            <p role="alert">Не удалось загрузить содержимое дней: {state.daysError}</p>
          ) : state.days.length === 0 ? (
            <p>Задания для этого плана ещё не добавлены.</p>
          ) : null}

          <section className={daysClassName} aria-label="Дни плана">
            {dayNumbers.map((number) => {
              const day = daysByNumber.get(number);
              return (
                <article key={number} className={dayClassName}>
                  <h2>День {number}</h2>
                  {day ? (
                    <>
                      <details>
                        <summary>Подробнее</summary>
                        <p>{day.description}</p>
                      </details>
                      <input
                        type="checkbox"
                        id={`agree-${day.id}`}
                        disabled={!day.canCheck}
                        checked={checkedDays[day.id] ?? day.check}
                        onChange={(event) =>
                          setCheckedDays((previous) => ({
                            ...previous,
                            [day.id]: event.target.checked,
                          }))
                        }
                      />
                      <label htmlFor={`agree-${day.id}`}>
                        Выполнил(а) задание{!day.canCheck && " (ещё недоступно)"}
                      </label>
                      {reviewClasses && checkedDays[day.id] && (
                        <button type="button" onClick={() => setSelectedDay(day)}>
                          Оставить отзыв
                        </button>
                      )}
                    </>
                  ) : (
                    <p>{state.daysError ? "Содержимое дня недоступно." : "Содержимое дня ещё не добавлено."}</p>
                  )}
                </article>
              );
            })}
          </section>
        </>
      )}

      {reviewClasses && selectedDay && (
        <div className={reviewClasses.overlay}>
          <div className={reviewClasses.modal}>
            <h2>Отзыв за {selectedDay.number} день</h2>
            <label>Количество звёзд</label>
            <div className={reviewClasses.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={review.stars >= star ? reviewClasses.activeStar : reviewClasses.star}
                  onClick={() => setReview((previous) => ({ ...previous, stars: star }))}
                >
                  ★
                </span>
              ))}
            </div>
            <label>Комментарий</label>
            <textarea
              placeholder="Напишите отзыв..."
              value={review.comment}
              onChange={(event) => setReview((previous) => ({ ...previous, comment: event.target.value }))}
            />
            <div className={reviewClasses.buttons}>
              <button
                type="button"
                onClick={() => {
                  console.log({ day: selectedDay.number, stars: review.stars, comment: review.comment });
                  setSelectedDay(null);
                  setReview({ stars: 5, comment: "" });
                }}
              >
                Отправить
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDay(null);
                  setReview({ stars: 5, comment: "" });
                }}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
