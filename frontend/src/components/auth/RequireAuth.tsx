"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * Единая точка входа в защищённую часть приложения. Оборачивает
 * `(dashboard)/layout.tsx`, то есть все маршруты внутри этой группы —
 * дашборд, наряды, аналитика, зарплаты, сотрудники и т.д. Пока не
 * пройдена авторизация, приложение (AppShell/страницы) вообще не
 * монтируется — это и есть смысл переноса проверки на базовый маршрут,
 * а не в конкретную фичу (employees).
 *
 * НЕ оборачивает `/login`, `/setup` и `/invites/[token]/accept` — эти
 * страницы живут вне группы `(dashboard)` в дереве `src/app`, поэтому
 * данный компонент их не затрагивает и не может случайно закрыть доступ
 * к принятию приглашения неавторизованным пользователем.
 */
export function RequireAuth({ children }: Readonly<{ children: ReactNode }>) {
	const { loading, isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.replace("/login");
		}
	}, [loading, isAuthenticated, router]);

	if (loading || !isAuthenticated) {
		return (
			<div className="flex h-dvh items-center justify-center bg-bg">
				<p className="text-md text-fg-muted">Проверяем сессию…</p>
			</div>
		);
	}

	return <>{children}</>;
}
