export interface PlanDay {
  id: number;
  countDay: string;
  description: string;
}

export interface Plan7 {
  id: number;
  number: number;
  description: string;
  habitNameId: number;
  planDayId: number;
  check: boolean;
  canCheck: boolean;
}

export interface Plan14 {
  id: number,
  number: number,
  description: string,
  habitNameId: number,
  planDayId: number,
  check: boolean,
  canCheck: boolean
}

export interface Plan30 {
  id: number,
  number: number,
  description: string,
  habitNameId: number,
  planDayId: number,
  check: boolean,
  canCheck: boolean
}

export interface Habit {
    id: number;
    name: string;
    slug: string;
}