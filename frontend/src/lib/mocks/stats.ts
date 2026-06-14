import { OrderStat } from "../types/stats";

export const DASHBOARD_STATS: OrderStat[] = [
	{ id: "work", value: 23, label: "в работе", delta: 13, trend: "up" },
	{ id: "done", value: 13, label: "выполнено", delta: 4, trend: "up" },
	{ id: "dead", value: 4, label: "дедлайн", delta: 2, trend: "down" },
];
