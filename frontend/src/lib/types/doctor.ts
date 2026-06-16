/** Врач-заказчик из клиники. */
export interface Doctor {
  id: string;
  /** ФИО полностью. */
  name: string;
  /** Короткая форма, «Тикус С. А.». */
  short: string;
  clinic: string;
  avatar: string | null;
}
