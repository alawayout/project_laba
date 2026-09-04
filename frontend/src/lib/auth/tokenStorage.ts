"use client";

const ACCESS_KEY = "labbor_access_token";
const REFRESH_KEY = "labbor_refresh_token";

export interface StoredTokens {
	accessToken: string;
	refreshToken: string;
}

/** Читает пару токенов из localStorage. null на сервере / без сессии. */
export function loadTokens(): StoredTokens | null {
	if (typeof window === "undefined") return null;
	try {
		const accessToken = window.localStorage.getItem(ACCESS_KEY);
		const refreshToken = window.localStorage.getItem(REFRESH_KEY);
		if (!accessToken || !refreshToken) return null;
		return { accessToken, refreshToken };
	} catch {
		return null;
	}
}

export function saveTokens(tokens: StoredTokens): void {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(ACCESS_KEY, tokens.accessToken);
		window.localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
	} catch {
		// приватный режим браузера / хранилище недоступно — просто не сохраняем
	}
}

export function clearTokens(): void {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(ACCESS_KEY);
		window.localStorage.removeItem(REFRESH_KEY);
	} catch {
		// noop
	}
}

export interface AccessTokenPayload {
	/** userId */
	sub: string;
	/** id сессии */
	sid: string;
	labId?: string;
	role?: "OWNER" | "ADMIN" | "TECHNICIAN";
	isSuperAdmin?: boolean;
	exp?: number;
}

/**
 * Декодирует payload access-токена без проверки подписи — только для
 * мгновенных UI-подсказок (роль/лаба в топбаре и т.п.). Сервер всё равно
 * перепроверяет права на каждый запрос, так что доверять этому для
 * реальных решений о доступе нельзя.
 */
export function decodeAccessToken(token: string): AccessTokenPayload | null {
	try {
		const payload = token.split(".")[1];
		if (!payload) return null;
		const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
		const json = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
				.join(""),
		);
		return JSON.parse(json) as AccessTokenPayload;
	} catch {
		return null;
	}
}
