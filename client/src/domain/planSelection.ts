import type { Habit, PlanDay } from "./interface";

export function selectHabitAndPlan(
  habits: Habit[],
  plans: PlanDay[],
  habitSlug: string,
  duration: string,
): { habit: Habit | undefined; plan: PlanDay | undefined } {
  return {
    habit: habits.find((item) => item.slug === habitSlug),
    plan: plans.find((item) => item.countDay === duration),
  };
}

export function getDayNumbers(countDay: string): number[] {
  const count = Number(countDay);
  return Number.isSafeInteger(count) && count > 0
    ? Array.from({ length: count }, (_, index) => index + 1)
    : [];
}
