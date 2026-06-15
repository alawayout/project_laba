/** Сущности, по которым работает глобальный поиск. */
export type SearchEntity = "orders" | "techs" | "doctors";

/** Фрагмент текста для подсветки совпадения. */
export interface HighlightPart {
  text: string;
  match: boolean;
}
