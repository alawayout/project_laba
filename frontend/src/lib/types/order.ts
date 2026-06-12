import type { DateTimeValue, ID, OrderStatus } from "./common";
import type { Technician } from "./staff";

/** Execution status of a single production stage. */
export type StageStatus = "done" | "work" | "wait";

/** Completed-stage report, shown in the "Отчёт" modal. */
export interface StageReport {
  readonly takenAt: string; // "10.09.2025 в 10:00"
  readonly completedAt: string; // "10.09.2025 в 12:37"
  readonly duration: string; // "2 ч 37 мин"
  readonly comment: string;
}

/** One production stage of an order (Гипсовка, Каркас, …). */
export interface WorkStage {
  readonly id: ID;
  readonly step: string; // "1 этап"
  readonly name: string; // "Гипсовка"
  readonly technician: Technician;
  readonly status: StageStatus;
  readonly timeline: string | null; // "Завершено 07.09.2025 в 13:44"
  readonly deadlineNote?: string; // "Нарушен срок сдачи на 2 дня"
  readonly report?: StageReport;
}

/** Compact order representation rendered on the dashboard grid. */
export interface OrderSummary {
  readonly id: ID;
  readonly number: string; // "263447"
  readonly workType: string;
  readonly doctor: string;
  readonly patient: string;
  readonly technician: string;
  readonly dueLabel: string; // "19.09.2025 · 10:00"
  readonly fittingLabel: string;
  readonly status: OrderStatus;
  readonly urgent?: boolean;
}

/** Full order entity rendered on the detail screen. */
export interface OrderDetail {
  readonly id: ID;
  readonly number: string;
  readonly doctor: string;
  readonly patient: string;
  readonly workType: string;
  readonly color: string; // "A-20, A-21"
  readonly selectedTeeth: readonly number[]; // FDI numbers 1..32
  readonly due: DateTimeValue;
  readonly fittings: readonly DateTimeValue[];
  readonly priority: boolean;
  readonly comment: string;
  readonly photos: readonly string[];
  readonly stages: readonly WorkStage[];
}
