"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import {
	clearTokens,
	decodeAccessToken,
	loadTokens,
	saveTokens,
	type AccessTokenPayload,
} from "@/lib/auth/tokenStorage";
import { SESSION_EXPIRED_EVENT } from "@/lib/api/authFetch";
import { logoutRequest } from "@/lib/api/auth";
import { getMyProfile, type MyProfile } from "@/lib/api/users";
import type { TokenPair } from "@/lib/api/types";

interface AuthState {
	/** Декодированный access-токен: userId/labId/role — для мгновенных подсказок в UI. */
	session: AccessTokenPayload | null;
	profile: MyProfile | null;
	/** Первичная проверка localStorage/профиля при монтировании ещё идёт. */
	loading: boolean;
}

interface AuthApi extends AuthState {
	isAuthenticated: boolean;
	signIn: (tokens: TokenPair) => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthApi | null>(null);

const EMPTY_STATE: AuthState = { session: null, profile: null, loading: false };

/**
 * Единый источник правды об авторизации на фронте: хранит токены
 * (localStorage), декодирует роль/лабу из access-токена для мгновенного
 * рендера и подгружает полный профиль через /users/me. Любой авторизованный
 * запрос (authFetch), не сумевший обновить токены, шлёт SESSION_EXPIRED_EVENT —
 * здесь это приводит к локальному логауту.
 */
export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
	const [state, setState] = useState<AuthState>({ ...EMPTY_STATE, loading: true });

	const loadProfile = useCallback(async (session: AccessTokenPayload) => {
		try {
			const profile = await getMyProfile();
			setState({ session, profile, loading: false });
		} catch {
			// Токен валиден, но профиль подтянуть не вышло (бэкенд недоступен и т.п.) —
			// всё равно считаем пользователя вошедшим по данным из токена.
			setState({ session, profile: null, loading: false });
		}
	}, []);

	useEffect(() => {
		const tokens = loadTokens();
		const session = tokens ? decodeAccessToken(tokens.accessToken) : null;
		if (session) {
			void loadProfile(session);
		} else {
			setState({ ...EMPTY_STATE, loading: false });
		}
	}, [loadProfile]);

	useEffect(() => {
		function onExpired() {
			setState({ ...EMPTY_STATE, loading: false });
		}
		window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
		return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
	}, []);

	const signIn = useCallback(
		async (tokens: TokenPair) => {
			saveTokens(tokens);
			const session = decodeAccessToken(tokens.accessToken);
			if (session) {
				await loadProfile(session);
			}
		},
		[loadProfile],
	);

	const signOut = useCallback(async () => {
		const tokens = loadTokens();
		clearTokens();
		setState({ ...EMPTY_STATE, loading: false });
		if (tokens) {
			try {
				await logoutRequest(tokens.accessToken);
			} catch {
				// сессия уже сброшена локально — молча игнорируем сетевую ошибку
			}
		}
	}, []);

	return (
		<AuthContext.Provider
			value={{ ...state, isAuthenticated: !!state.session, signIn, signOut }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthApi {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return ctx;
}
