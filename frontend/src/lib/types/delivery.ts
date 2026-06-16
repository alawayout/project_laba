/** Статус оплаты доставки. */
export type DeliveryPayStatus = "to-pay" | "paid";

/** Состояние фото посылки. */
export type DeliveryPhoto = "view" | "attach";

/** Окно отображения доставок. */
export type DeliveryRange = "week" | "day";

/** Доставка наряда курьером в лабораторию/клинику. */
export interface Delivery {
  id: string;
  lab: string;
  courier: string | null;
  payAmount: number | null;
  payStatus: DeliveryPayStatus | null;
  dateTime: string; // "22.07.2026 в 11:20"
  orderNum: string;
  photo: DeliveryPhoto;
}
