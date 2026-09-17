export interface PlanDay {
  id: number;
  countDay: string;
  description: string;
}

export interface DayContent {
  id: number;
  number: number;
  description: string;
  habitNameId: number;
  planDayId: number;
  check: boolean;
  canCheck: boolean;
}

export type Plan7 = DayContent;
export type Plan14 = DayContent;
export type Plan30 = DayContent;

export interface Habit {
    id: number;
    name: string;
    slug: string;
}
