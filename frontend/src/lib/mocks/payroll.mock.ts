import type { PayrollPeriod, PayrollRow } from "@/lib/types";

const CHART = {
  fixed: "var(--color-chart-fixed)",
  orders: "var(--color-chart-orders)",
  fines: "var(--color-chart-fines)",
} as const;

/** Technician self-view ("Мои доходы"): current period detail. */
export const currentPeriod: PayrollPeriod = {
  id: "period-2025-07",
  label: "Июль",
  total: 22000,
  parts: [
    { kind: "fixed", label: "Фиксированная", amount: 16000, color: CHART.fixed },
    { kind: "orders", label: "Наряды", amount: 8000, color: CHART.orders },
    { kind: "fines", label: "Штрафы", amount: -2000, color: CHART.fines },
  ],
  completed: [
    { id: "w1", label: "1 июл – 6 июл", count: 9, result: "partial" },
    { id: "w2", label: "7 июл – 13 июл", count: 15, result: "done" },
    { id: "w3", label: "14 июл – 20 июл", count: 5, result: "failed" },
    { id: "w4", label: "21 июл – 27 июл", count: 12, result: "partial" },
    { id: "w5", label: "28 июл – 31 июл", count: 7, result: "partial" },
  ],
  payout: "pending",
};

/** Admin payroll table: per-technician period summaries. */
export const payrollRows: PayrollRow[] = [
  {
    id: "pr-darius",
    technicianId: "tech-darius",
    name: "Дариуш Мария Владимировна",
    category: "2 категория",
    avatarUrl: "/avatars/avatar-tech.png",
    total: 31200,
    ordersDone: 18,
    payout: "pending",
  },
  {
    id: "pr-kolbin",
    technicianId: "tech-kolbin",
    name: "Колбин Сергей Александрович",
    category: "3 категория",
    avatarUrl: null,
    total: 22000,
    ordersDone: 14,
    payout: "pending",
  },
  {
    id: "pr-markova",
    technicianId: "tech-markova",
    name: "Маркова Светлана Алексеевна",
    category: "3 категория",
    avatarUrl: null,
    total: 27450,
    ordersDone: 16,
    payout: "paid",
  },
];
