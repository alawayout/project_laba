/** Цвет пилюли задачи в расписании дня. */
export type TaskColor = "lime" | "blue" | "purple";

/** Задача из таймлайна «Задачи на день». */
export interface DayTask {
  id: string;
  time: string; // "09:00"
  label: string;
  color: TaskColor;
  /** Задача выполнена — узел становится зелёным с галочкой. */
  done: boolean;
  /** Будущая задача — узел рисуется серым. */
  upcoming?: boolean;
}
