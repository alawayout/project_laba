import type { Trend } from "./common";

/** A single dashboard headline metric. */
export interface OrderStat {
	readonly id: string;
	readonly value: number;
	readonly label: string; // "в работе"
	readonly delta: number; // signed change vs previous period
	readonly trend: Trend;
	/** When true, the delta is a negative signal even if numerically positive. */
	readonly negative?: boolean;
}
