"use client";

import { apiFetch, ApiRequestError } from "./client";
import { PUBLIC_API_URL } from "./config";
import { refreshTokens } from "./auth";
import { clearTokens, loadTokens, saveTokens } from "@/lib/auth/tokenStorage";

/** Событие «сессия истекла» — слушает AuthProvider, чтобы сбросить состояние. */
export const SESSION_EXPIRED_EVENT = "labbor:session-expired";

function notifySessionExpired(): void {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
	}
}

let refreshPromise: Promise<string | null> | null = null;

/** Гарантирует единственный одновременный запрос на обновление токенов. */
function ensureFreshAccessToken(): Promise<string | null> {
	const tokens = loadTokens();
	if (!tokens) return Promise.resolve(null);

	if (!refreshPromise) {
		refreshPromise = refreshTokens(tokens.refreshToken)
			.then((pair) => {
				saveTokens(pair);
				return pair.accessToken;
			})
			.catch(() => {
				clearTokens();
				notifySessionExpired();
				return null;
			})
			.finally(() => {
				refreshPromise = null;
			});
	}
	return refreshPromise;
}

/**
 * Авторизованный запрос к API: подставляет access-токен из хранилища.
 * На 401 один раз пробует обновить пару токенов и повторяет запрос —
 * если не вышло, сбрасывает сессию и пробрасывает исходную ошибку.
 */
export async function authFetch<T>(path: string, init?: RequestInit): Promise<T> {
	const tokens = loadTokens();
	if (!tokens) {
		notifySessionExpired();
		throw new ApiRequestError(401, "Не выполнен вход в систему");
	}

	try {
		return await apiFetch<T>(PUBLIC_API_URL, path, {
			...init,
			headers: { ...init?.headers, Authorization: `Bearer ${tokens.accessToken}` },
		});
	} catch (error) {
		if (error instanceof ApiRequestError && error.statusCode === 401) {
			const freshToken = await ensureFreshAccessToken();
			if (!freshToken) {
				throw error;
			}
			return apiFetch<T>(PUBLIC_API_URL, path, {
				...init,
				headers: { ...init?.headers, Authorization: `Bearer ${freshToken}` },
			});
		}
		throw error;
	}
}
