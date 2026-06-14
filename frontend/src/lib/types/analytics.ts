import type { ID, Trend } from "./common";

/** Headline KPI on the analytics screen. */
export interface AnalyticsKpi {
  readonly id: ID;
  readonly label: string;
  readonly value: string; // pre-formatted ("128", "1.84 М ₽")
  readonly delta: number; // percent
  readonly trend: Trend;
}

/** One point in a time series (orders per week/month). */
export interface SeriesPoint {
  readonly id: ID;
  readonly label: string;
  readonly value: number;
}

/** Distribution slice (orders by status / by work type). */
export interface DistributionSlice {
  readonly id: ID;
  readonly label: string;
  readonly value: number;
  readonly color: string;
}
