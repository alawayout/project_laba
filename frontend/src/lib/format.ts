/** Формат суммы в рублях: 5000 → «5 000 ₽». */
export const formatMoney = (value: number): string =>
  `${value.toLocaleString("ru-RU")} ₽`;

/** Список выбранных зубов: [23, 10] → «10; 23;». */
export const formatTeeth = (teeth: number[]): string =>
  teeth.length
    ? `${[...teeth].sort((a, b) => a - b).join("; ")};`
    : "—";

/** Только цифры из строки ввода. */
export const digitsOnly = (value: string): string => value.replace(/\D/g, "");
