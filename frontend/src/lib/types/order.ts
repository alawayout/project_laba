import type { ID, OrderStatus } from "./common";
import type { Technician } from "./staff";

/** Completed-stage report, shown in the "Отчёт" modal. */
export interface StageReport {
	readonly takenAt: string; // "10.09.2025 в 10:00"
	readonly completedAt: string; // "10.09.2025 в 12:37"
	readonly duration: string; // "2 ч 37 мин"
	readonly comment: string;
}

/** One production stage of an order (Гипсовка, Каркас, …). */
export interface WorkStage {
	readonly id: string;
	readonly step: string; // "1 этап"
	readonly name: string; // "Гипсовка"
	readonly technician: Technician;
	readonly status: OrderStatus;
	readonly timeline: string | null; // "Завершено 07.09.2025 в 13:44"
	readonly deadlineNote?: string; // "Нарушен срок сдачи на 2 дня"
	readonly report?: StageReport;
}

/** Compact order representation rendered on the dashboard grid. */
export interface OrderSummary {
	readonly id: ID;
	readonly number: string;
	readonly doctor: string;
	readonly patient: string;
	readonly workType: string;
	readonly technician: string;
	readonly dueLabel: string; // "19.09.2025 · 10:00"
	readonly fittingLabel: string; // "15.09.2025 · 12:30"
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
	readonly technician: string;
	readonly dueLabel: string; // "19.09.2025 · 10:00"
	readonly fittingLabel: string; // "15.09.2025 · 12:30"
	readonly status: OrderStatus;
	readonly urgent?: boolean;
	readonly color: string; // "A-20, A-21"
	readonly selectedTeeth: number[]; // [10, 23]
	readonly fittings: { date: string; time: string }[]; // [{ date: "15.09.2025", time: "12:30" }, …]
	readonly comment: string;
	readonly photos: string[]; // ["/orders/photo-1.png", "/orders/photo-2.png"]
	readonly stages: WorkStage[];
	readonly due: { date: string; time: string }; // { date: "19.09.2025", time: "10:00" }
	readonly priority: boolean;
}
