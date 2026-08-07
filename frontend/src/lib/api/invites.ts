import { apiFetch } from "./client";
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

export const ROLE_LABELS: Record<LabRole, string> = {
	OWNER: "Владелец",
	ADMIN: "Администратор",
	TECHNICIAN: "Техник",
};
