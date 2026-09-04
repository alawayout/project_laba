"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getDefaultRoute } from "@/components/layout/nav-items";

/**
 * "/" — мок-дашборд "Наряды" для сотрудников лабы; платформенному
 * администратору (сессия без своей лабы) он не нужен и не имеет смысла —
 * уводим на первый реально доступный ему маршрут (см. getDefaultRoute,
 * сейчас это /labs). Отдельно от редиректа после логина (useLogin.ts) —
 * этот guard нужен на случай прямого захода по адресу "/", когда сессия
 * уже есть (например, вкладка была открыта раньше).
 */
export function RedirectIfSuperAdmin({ children }: Readonly<{ children: ReactNode }>) {
	const { session } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (session?.isSuperAdmin) {
			router.replace(getDefaultRoute(session));
		}
	}, [session, router]);

	if (session?.isSuperAdmin) {
		return null;
	}

	return <>{children}</>;
}
