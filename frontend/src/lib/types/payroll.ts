import type { ID } from "./common";

/** A single earnings component within a period. */
export type EarningKind = "fixed" | "orders" | "fines";

export interface EarningPart {
  readonly kind: EarningKind;
  readonly label: string;
  readonly amount: number; // RUB; fines are negative
  readonly color: string; // CSS colour token/hex
}

/** One bucket of completed orders (a week within the period). */
export type BucketResult = "done" | "partial" | "failed";

export interface CompletedBucket {
  readonly id: ID;
  readonly label: string; // "1 июл - 6 июл"
  readonly count: number;
  readonly result: BucketResult;
}

export type PayoutStatus = "pending" | "paid";

/** A pay period for one technician (the "Мои доходы" model). */
export interface PayrollPeriod {
  readonly id: ID;
  readonly label: string; // "Июль"
  readonly total: number; // net RUB
  readonly parts: readonly EarningPart[];
  readonly completed: readonly CompletedBucket[];
  readonly payout: PayoutStatus;
  readonly payoutDate?: string; // "09.07.2025" when paid
}

/** Admin payroll row: one technician's period summary. */
export interface PayrollRow {
  readonly id: ID;
  readonly technicianId: ID;
  readonly name: string;
  readonly category: string;
  readonly avatarUrl: string | null;
  readonly total: number;
  readonly ordersDone: number;
  readonly payout: PayoutStatus;
}
