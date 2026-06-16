import type { DateTimeValue } from "./common";

/** Режим формы наряда. */
export type OrderFormMode = "create" | "edit";

/** Быстрый выбор группы зубов на карте. */
export type ToothArch = "all" | "upper" | "lower";

/** Этап производства в форме (техник может быть не назначен). */
export interface OrderFormStage {
  id: string;
  step: string; // "1 этап"
  name: string; // "Гипсовка"
  technicianId: string | null;
}

/** Примерка в форме наряда. */
export interface OrderFormFitting {
  id: string;
  date: string;
  time: string;
}

/** Фото работы в форме (src — путь или blob-URL загруженного файла). */
export interface OrderFormPhoto {
  id: string;
  src: string;
}

/** Значения формы создания/редактирования наряда. */
export interface OrderFormValues {
  number: string;
  doctorId: string;
  patient: string;
  workTypeId: string;
  color: string;
  teeth: number[];
  stages: OrderFormStage[];
  due: DateTimeValue;
  fittings: OrderFormFitting[];
  priority: boolean;
  comment: string;
  photos: OrderFormPhoto[];
}
