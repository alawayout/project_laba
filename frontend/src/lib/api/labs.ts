import { authFetch } from "./authFetch";
import type { LabRole } from "./invites";

export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "PAST_DUE" | "EXPIRED" | "CANCELED";

export interface LabSubscription {
	plan: string;
	status: SubscriptionStatus;
	expiresAt: string;
}

export interface LabOwner {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export interface LabSummary {
	id: string;
	name: string;
	createdAt: string;
	subscription: LabSubscription | null;
	owner: LabOwner | null;
	membersCount: number;
}

export interface LabMember {
	userId: string;
	role: LabRole;
	status: "ACTIVE" | "BLOCKED";
	firstName: string;
	lastName: string;
	email: string;
}

export interface LabDetail extends LabSummary {
	members: LabMember[];
}

export interface CreateLabInput {
	labName: string;
	/** Не выводим в UI создания лабы — бэк сам подставит значение по умолчанию. */
	plan?: string;
	trialDays?: number;
	ownerEmail: string;
	ownerFirstName: string;
	ownerLastName: string;
}

export interface CreateLabResult {
	lab: { id: string; name: string };
	invite: { email: string; expiresAt: string; acceptUrl: string };
}

export interface UpdateLabInput {
	name?: string;
	plan?: string;
	/** Новая дата окончания подписки, ISO-строка. */
	expiresAt?: string;
}

/** Список всех лабораторий платформы (только платформенный админ). */
export function listLabs() {
	return authFetch<LabSummary[]>("/labs");
}

/** Карточка одной лабы с участниками. */
export function getLab(labId: string) {
	return authFetch<LabDetail>(`/labs/${labId}`);
}

/** Создать лабу + приглашение владельцу. */
export function createLab(input: CreateLabInput) {
	return authFetch<CreateLabResult>("/labs", {
		method: "POST",
		body: JSON.stringify(input),
	});
}

/** Переименовать лабу и/или сменить тариф. */
export function updateLab(labId: string, input: UpdateLabInput) {
	return authFetch<LabDetail>(`/labs/${labId}`, {
		method: "PATCH",
		body: JSON.stringify(input),
	});
}

/** Мягкое удаление: подписка → CANCELED, сессии сотрудников отзываются. */
export function blockLab(labId: string) {
	return authFetch<LabDetail>(`/labs/${labId}`, { method: "DELETE" });
}

/** Восстановление ранее заблокированной лабы. */
export function restoreLab(labId: string) {
	return authFetch<LabDetail>(`/labs/${labId}/restore`, { method: "POST" });
}
