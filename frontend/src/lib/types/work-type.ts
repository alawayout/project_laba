import type { ID } from "./common";

/** A production stage template within a work type. */
export interface WorkTypeStage {
  readonly id: ID;
  readonly name: string; // "Гипсовка"
  readonly durationDays: number;
}

/** A catalogue entry in the "Виды работ" reference. */
export interface WorkType {
  readonly id: ID;
  readonly name: string; // "Ацеталовый бюгельный протез"
  readonly category: string; // "Бюгельные протезы"
  readonly price: number; // RUB
  readonly leadDays: number; // total production time
  readonly stages: readonly WorkTypeStage[];
  readonly active: boolean;
}
