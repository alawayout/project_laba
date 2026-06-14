import type { ID } from "./common";

/** A lab technician who executes work stages. */
export interface Technician {
	readonly id: string;
	readonly name: string; // "Дариуш Мария Владимировна"
	readonly short: string; // "Дариуш М. В."
	readonly category: string; // "2 категория"
	readonly avatarUrl: string | null;
}

/** Access scopes for the SaaS CMS. */
export type UserRole = "super-admin" | "lab-admin" | "tech";

/** The signed-in operator shown in the top bar. */
export interface CurrentUser {
	readonly id: ID;
	readonly name: string;
	readonly role: UserRole;
	readonly roleLabel: string; // localized, e.g. "Администратор"
	readonly avatarUrl: string;
}
