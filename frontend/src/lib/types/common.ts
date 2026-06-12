/** Shared primitive types used across feature domains. */

export type ID = string;

/** Order lifecycle status — drives `Badge` colour variants. */
export type OrderStatus =
  | "done"
  | "work"
  | "wait"
  | "dead"
  | "lab"
  | "clinic";

/** A split calendar value as shown in read-only fields. */
export interface DateTimeValue {
  readonly date: string; // "19.09.2025"
  readonly time: string; // "10:00"
}

/** Trend direction for stat deltas. */
export type Trend = "up" | "down";
