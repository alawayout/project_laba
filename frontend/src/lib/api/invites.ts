import { apiFetch } from "./client";
import { authFetch } from "./authFetch";
import { PUBLIC_API_URL, SERVER_API_URL } from "./config";
import type { TokenPair } from "./types";

export type LabRole = "OWNER" | "ADMIN" | "TECHNICIAN";

export interface InviteInfo {
	email: string;
	labName: string;
	role: LabRole;
	expiresAt: string;
	userExists: boolean;
}

export interface AcceptInviteInput {
	/** Нужен только если под этим email ещё нет аккаунта. */
	password?: string;
	firstName?: string;
	lastName?: string;
}

/** Серверный вызов (страница) — данные приглашения перед показом формы. */
export function getInviteInfo(token: string, baseUrl: string = SERVER_API_URL) {
	return apiFetch<InviteInfo>(baseUrl, `/public/invites/${token}`);
}

/** Клиентский вызов (сабмит формы). */
export function acceptInvite(token: string, input: AcceptInviteInput) {
	return apiFetch<TokenPair>(PUBLIC_API_URL, `/public/invites/${token}/accept`, {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export interface CreateInviteInput {
	email: string;
	role: Extract<LabRole, "ADMIN" | "TECHNICIAN">;
}

export interface CreateInviteResult {
	email: string;
	role: LabRole;
	expiresAt: string;
	acceptUrl: string;
}

/** Авторизованный вызов (кабинет OWNER/ADMIN) — пригласить нового сотрудника в лабу. */
export function createInvite(labId: string, input: CreateInviteInput) {
	return authFetch<CreateInviteResult>(`/labs/${labId}/invites`, {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export type InviteStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

export interface InviteListItem {
	id: string;
	email: string;
	role: LabRole;
	status: InviteStatus;
	expiresAt: string;
	createdAt: string;
	invitedBy: { id: string; firstName: string; lastName: string; email: string } | null;
	/** Ссылка на принятие — только пока приглашение ещё PENDING и не истекло. */
	acceptUrl: string | null;
}

/** Авторизованный вызов — все приглашения лабы (в т.ч. принятые/истёкшие/отозванные). */
export function listInvites(labId: string) {
	return authFetch<InviteListItem[]>(`/labs/${labId}/invites`);
}

/** Отзыв ещё не принятого приглашения. */
export function revokeInvite(labId: string, inviteId: string) {
	return authFetch<unknown>(`/labs/${labId}/invites/${inviteId}`, { method: "DELETE" });
}

export const ROLE_LABELS: Record<LabRole, string> = {
	OWNER: "Владелец",
	ADMIN: "Администратор",
	TECHNICIAN: "Техник",
};
