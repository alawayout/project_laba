import { apiFetch } from "./client";
import { PUBLIC_API_URL, SERVER_API_URL } from "./config";
import type { TokenPair } from "./types";

export interface SetupStatus {
	initialized: boolean;
}

export interface CreateSuperAdminInput {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

/** Для серверных вызовов (middleware) — по умолчанию внутренний URL бэкенда. */
export function getSetupStatus(baseUrl: string = SERVER_API_URL) {
	return apiFetch<SetupStatus>(baseUrl, "/public/setup/status");
}

/** Для клиентских вызовов (форма) — всегда публичный URL. */
export function createSuperAdmin(input: CreateSuperAdminInput) {
	return apiFetch<TokenPair>(PUBLIC_API_URL, "/public/setup", {
		method: "POST",
		body: JSON.stringify(input),
	});
}
