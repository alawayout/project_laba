import type { ID } from "./common";

/** A lab technician who executes work stages. */
export interface Technician {
	readonly id: string;
	readonly name: string; // "Дариуш Мария Владимировна"
	readonly short: string; // "Дариуш М. В."
	readonly category: string; // "2 категория"
	readonly avatarUrl: string | null;
}
