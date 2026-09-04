import { apiFetch } from "./client";
import { PUBLIC_API_URL } from "./config";
import type { TokenPair } from "./types";
import type { LabRole } from "./invites";

export interface LoginInput {
	email: string;
	password: string;
	/** Нужен, если у пользователя несколько активных лаб. */
	labId?: string;
}

export interface LabChoice {
	labId: string;
	labName: string;
	role: LabRole;
}

/** Либо готовая пара токенов, либо — если лаб несколько — список на выбор. */
export type LoginResult = TokenPair | { requiresLabSelection: true; labs: LabChoice[] };

export function login(input: LoginInput) {
	return apiFetch<LoginResult>(PUBLIC_API_URL, "/public/auth/login", {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export function refreshTokens(refreshToken: string) {
	return apiFetch<TokenPair>(PUBLIC_API_URL, "/public/auth/refresh", {
		method: "POST",
		body: JSON.stringify({ refreshToken }),
	});
}

/** Отзывает текущую (по access-токену) сессию на бэкенде. */
export function logoutRequest(accessToken: string) {
	return apiFetch<void>(PUBLIC_API_URL, "/auth/logout", {
		method: "POST",
		headers: { Authorization: `Bearer ${accessToken}` },
	});
}
