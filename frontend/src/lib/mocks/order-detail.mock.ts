import type { OrderDetail } from "@/lib/types";
import { technicians } from "./staff.mock";

const [darius] = technicians;

/** Fully-specified orders keyed by id (detail screen source). */
const orderDetails: Record<string, OrderDetail> = {
  "263447": {
    id: "263447",
    number: "263447",
    doctor: "Тикус Сергей Александрович",
    patient: "Тамарова Ольга Александровна",
    workType: "Ацеталовый бюгельный протез",
    color: "A-20, A-21",
    selectedTeeth: [10, 23],
    due: { date: "19.09.2025", time: "10:00" },
    fittings: [
      { date: "15.09.2025", time: "12:30" },
      { date: "17.09.2025", time: "14:20" },
    ],
    priority: true,
    comment: "Имеются особенности строения челюсти",
    photos: ["/orders/photo-1.png", "/orders/photo-2.png"],
    stages: [
      {
        id: "263447-s1",
        step: "1 этап",
        name: "Гипсовка",
        technician: darius,
        status: "done",
        timeline: "Завершено 07.09.2025 в 13:44",
        report: {
          takenAt: "10.09.2025 в 10:00",
          completedAt: "10.09.2025 в 12:37",
          duration: "2 ч 37 мин",
          comment:
            "Выполнила работу в срок, был брак, использовала больше материала",
        },
      },
      {
        id: "263447-s2",
        step: "2 этап",
        name: "Каркас",
        technician: darius,
        status: "work",
        timeline: "Начато 07.09.2025 в 14:12",
      },
      {
        id: "263447-s3",
        step: "3 этап",
        name: "Грунт",
        technician: darius,
        status: "wait",
        timeline: null,
      },
      {
        id: "263447-s4",
        step: "4 этап",
        name: "Нанесение",
        technician: darius,
        status: "work",
        timeline: null,
        deadlineNote: "Нарушен срок сдачи на 2 дня",
      },
    ],
  },
};

export function getOrderDetailById(id: string): OrderDetail | undefined {
  return orderDetails[id];
}

/** The order opened by default / featured on the dashboard. */
export const featuredOrderId = "263447";
