"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { DayContent, Habit, PlanDay } from "@/domain/interface";
import { getDayNumbers, selectHabitAndPlan } from "@/domain/planSelection";
import { apiService } from "@/service/ApiService";
import AuthRequiredDialog from "./AuthRequiredDialog";
import PlanDayCard from "./PlanDayCard";
import styles from "./PlanDetails.module.css";

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

interface PlanDetailsProps {
  habitSlug: string;
  duration: string;
  title: string;
}

interface StartPlanResponse {
  message: string;
  id: number;
  startDate: string;
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
}: PlanDetailsProps) {
  const [state, setState] = useState<PlanState>({ kind: "loading" });
  const [reloadVersion, setReloadVersion] = useState(0);
  const [starting, setStarting] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [startMessage, setStartMessage] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [savingDayId, setSavingDayId] = useState<number | null>(null);
  const [dayErrors, setDayErrors] = useState<Record<number, string>>({});
  const [selectedDay, setSelectedDay] = useState<DayContent | null>(null);
  const [review, setReview] = useState({ stars: 5, comment: "" });
  const progressRequestVersion = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const requestVersion = ++progressRequestVersion.current;
    const outdated = () => cancelled || requestVersion !== progressRequestVersion.current;

    async function loadPlan() {
      try {
        const [habitsResponse, plansResponse] = await Promise.all([
          apiService.apiClient.get<Habit[]>("/habits"),
          apiService.apiClient.get<PlanDay[]>("/planDay"),
        ]);
        if (outdated()) return;

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

        try {
          const daysResponse = await apiService.apiClient.get<DayContent[]>(
            `/habits/${habit.slug}/plan/plan${plan.countDay}`,
          );
          if (outdated()) return;
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
          if (!outdated()) {
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
        if (!outdated()) {
          setState({ kind: "error", message: getRequestError(error) });
        }
      }
    }

    void loadPlan();
    return () => {
      cancelled = true;
    };
  }, [habitSlug, duration, reloadVersion]);

  useEffect(() => {
    function refresh() {
      if (!document.hidden) setReloadVersion((version) => version + 1);
    }
    // Recheck server availability when returning to the tab; no client-side unlock timer.
    window.addEventListener("focus", refresh);
    window.addEventListener("session-changed", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("session-changed", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  async function handleCompleteDay(dayId: number, checked: boolean) {
    if (state.kind !== "ready" || savingDayId !== null || !checked) return;
    const day = state.days.find((item) => item.id === dayId);
    if (!day || !day.canCheck || day.check) return;
    ++progressRequestVersion.current;
    setSavingDayId(dayId);
    setDayErrors((previous) => ({ ...previous, [dayId]: "" }));
    try {
      const response = await apiService.apiClient.post<DayContent[]>(`/planDays/${dayId}/complete`, {}, {
        validateStatus: (status: number) => status === 401 || (status >= 200 && status < 300),
      });
      if (response.status === 401) {
        setAuthDialogOpen(true);
        setReloadVersion((version) => version + 1);
        return;
      }
      if (!Array.isArray(response.data)) throw new Error("API вернул неверный формат списка дней");
      ++progressRequestVersion.current;
      setState((previous) => previous.kind === "ready" && previous.habit.id === state.habit.id && previous.plan.id === state.plan.id
        ? { ...previous, days: response.data, daysError: null } : previous);
    } catch (error) {
      setDayErrors((previous) => ({ ...previous, [dayId]: `Не удалось сохранить выполнение: ${getRequestError(error)}` }));
    } finally {
      setSavingDayId(null);
    }
  }

  async function handleStartPlan() {
    if (state.kind !== "ready" || starting) return;

    setStarting(true);
    setStartError(null);
    setStartMessage(null);
    try {
      // Handle 401 here so the shared interceptor does not redirect before the dialog opens.
      const authRequest = { validateStatus: (status: number) => status === 401 || (status >= 200 && status < 300) };
      const currentUser = await apiService.apiClient.get<{ userId: number }>("/me", authRequest);
      if (currentUser.status === 401) {
        setAuthDialogOpen(true);
        return;
      }

      const response = await apiService.apiClient.post<StartPlanResponse>("/startPlan", {
        userId: currentUser.data.userId,
        habitNameId: state.habit.id,
        planDayId: state.plan.id,
        startDate: new Date().toISOString(),
      }, authRequest);
      if (response.status === 401) {
        setAuthDialogOpen(true);
        return;
      }
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
    <div className="planDetails viewportPage viewportContent">
      <h1>{title}</h1>

      {state.kind === "loading" && <p>Загрузка плана...</p>}
      {state.kind === "error" && <p role="alert">Не удалось загрузить план: {state.message}</p>}
      {state.kind === "not-found" && <p role="alert">{state.message}</p>}

      {state.kind === "ready" && (
        <>
          <p>План на {state.plan.countDay} дней</p>
          {!validDayCount && <p role="alert">У плана неверная длительность: {state.plan.countDay}</p>}
          <button className={styles.startPlanButton} type="button" onClick={handleStartPlan} disabled={starting || !validDayCount}>
            {starting ? "Запуск плана..." : "Начать план"}
          </button>
          {startMessage && <p role="status">{startMessage}</p>}
          {startError && <p role="alert">{startError}</p>}

          {state.daysError ? (
            <p role="alert">Не удалось загрузить содержимое дней: {state.daysError}</p>
          ) : state.days.length === 0 ? (
            <p>Задания для этого плана ещё не добавлены.</p>
          ) : null}

          <section className={styles.days} aria-label="Дни плана">
            {dayNumbers.map((number) => {
              const day = daysByNumber.get(number);
              return (
                <PlanDayCard
                  key={number}
                  number={number}
                  day={day}
                  checked={day?.check ?? false}
                  daysError={Boolean(state.daysError)}
                  saving={day !== undefined && savingDayId === day.id}
                  error={day ? dayErrors[day.id] : undefined}
                  onCheck={handleCompleteDay}
                  onReview={setSelectedDay}
                />
              );
            })}
          </section>
        </>
      )}

      {selectedDay && (
        <div className={styles.overlay}>
          <div className={`reviewModal ${styles.modal}`}>
            <h2>Отзыв за {selectedDay.number} день</h2>
            <label>Количество звёзд</label>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={review.stars >= star ? styles.activeStar : styles.star}
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
            <div className={styles.buttons}>
              <button
                type="button"
                onClick={() => {
                  console.log({
                    dayId: selectedDay.id,
                    day: selectedDay.number,
                    habitNameId: selectedDay.habitNameId,
                    planDayId: selectedDay.planDayId,
                    stars: review.stars,
                    comment: review.comment,
                  });
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
      {authDialogOpen && <AuthRequiredDialog onClose={() => setAuthDialogOpen(false)} />}
    </div>
  );
}
