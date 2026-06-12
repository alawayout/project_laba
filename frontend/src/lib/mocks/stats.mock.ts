import type { OrderStat } from "@/lib/types";

export const orderStats: OrderStat[] = [
  { id: "stat-work", value: 23, label: "в работе", delta: 13, trend: "up" },
  { id: "stat-done", value: 13, label: "выполнено", delta: 4, trend: "up" },
  {
    id: "stat-dead",
    value: 4,
    label: "дедлайн",
    delta: 2,
    trend: "up",
    negative: true,
  },
];
