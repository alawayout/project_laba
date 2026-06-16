import type { WorkType } from "@/lib/types";

export const workTypes: WorkType[] = [
  {
    id: "wt-acetal-clasp",
    name: "Ацеталовый бюгельный протез",
    category: "Бюгельные протезы",
    price: 28000,
    leadDays: 9,
    active: true,
    stages: [
      { id: "wt1-s1", name: "Гипсовка", durationDays: 1 },
      { id: "wt1-s2", name: "Каркас", durationDays: 3 },
      { id: "wt1-s3", name: "Грунт", durationDays: 2 },
      { id: "wt1-s4", name: "Нанесение", durationDays: 3 },
    ],
  },
  {
    id: "wt-metal-ceramic",
    name: "Металло-керамическая коронка",
    category: "Коронки",
    price: 9500,
    leadDays: 5,
    active: true,
    stages: [
      { id: "wt2-s1", name: "Моделировка", durationDays: 1 },
      { id: "wt2-s2", name: "Литьё каркаса", durationDays: 2 },
      { id: "wt2-s3", name: "Нанесение керамики", durationDays: 2 },
    ],
  },
  {
    id: "wt-zirconia-bridge",
    name: "Цирконовый мост 4 ед.",
    category: "Мосты",
    price: 32000,
    leadDays: 7,
    active: true,
    stages: [
      { id: "wt3-s1", name: "Сканирование", durationDays: 1 },
      { id: "wt3-s2", name: "Фрезеровка", durationDays: 3 },
      { id: "wt3-s3", name: "Окрашивание", durationDays: 1 },
      { id: "wt3-s4", name: "Глазуровка", durationDays: 2 },
    ],
  },
  {
    id: "wt-temp-crown",
    name: "Временные коронки",
    category: "Коронки",
    price: 2200,
    leadDays: 2,
    active: true,
    stages: [
      { id: "wt4-s1", name: "Моделировка", durationDays: 1 },
      { id: "wt4-s2", name: "Полимеризация", durationDays: 1 },
    ],
  },
  {
    id: "wt-wax-model",
    name: "Диагностическое моделирование на воске",
    category: "Прочее",
    price: 4800,
    leadDays: 3,
    active: false,
    stages: [
      { id: "wt5-s1", name: "Подготовка модели", durationDays: 1 },
      { id: "wt5-s2", name: "Wax-up", durationDays: 2 },
    ],
  },
];
