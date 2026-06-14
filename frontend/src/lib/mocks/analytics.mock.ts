import type { AnalyticsKpi, DistributionSlice, SeriesPoint } from "@/lib/types";

export const analyticsKpis: AnalyticsKpi[] = [
  { id: "kpi-orders", label: "Нарядов за месяц", value: "128", delta: 12, trend: "up" },
  { id: "kpi-revenue", label: "Выручка", value: "1.84 М ₽", delta: 8, trend: "up" },
  { id: "kpi-ontime", label: "В срок", value: "92%", delta: 3, trend: "up" },
  { id: "kpi-overdue", label: "Просрочено", value: "6", delta: 2, trend: "down" },
];

/** Orders completed per week across the current month. */
export const ordersSeries: SeriesPoint[] = [
  { id: "s1", label: "1 июл – 6 июл", value: 24 },
  { id: "s2", label: "7 июл – 13 июл", value: 38 },
  { id: "s3", label: "14 июл – 20 июл", value: 29 },
  { id: "s4", label: "21 июл – 27 июл", value: 37 },
];

/** Orders by lifecycle status (distribution donut/legend). */
export const statusDistribution: DistributionSlice[] = [
  { id: "d-work", label: "В работе", value: 23, color: "var(--color-work-fg)" },
  { id: "d-done", label: "Выполнено", value: 13, color: "var(--color-chart-orders)" },
  { id: "d-clinic", label: "В клинике", value: 8, color: "var(--color-clinic-fg)" },
  { id: "d-lab", label: "В лабе", value: 6, color: "var(--color-lab-fg)" },
  { id: "d-dead", label: "Дедлайн", value: 4, color: "var(--color-chart-fines)" },
];

/** Share of orders by work type. */
export const workTypeDistribution: DistributionSlice[] = [
  { id: "wt-crown", label: "Коронки", value: 42, color: "var(--color-chart-fixed)" },
  { id: "wt-bridge", label: "Мосты", value: 28, color: "var(--color-chart-orders)" },
  { id: "wt-clasp", label: "Бюгельные", value: 19, color: "var(--color-clinic-fg)" },
  { id: "wt-other", label: "Прочее", value: 11, color: "var(--color-fg-muted)" },
];
