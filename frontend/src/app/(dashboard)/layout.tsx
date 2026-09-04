import type { ReactNode } from "react";
import { AppShell } from "@/components/layout";
import { RequireAuth } from "@/components/auth/RequireAuth";

/**
 * Внутренний контур приложения — рейл + топбар, за общим шлюзом
 * авторизации (`RequireAuth`). Не применяется к public-страницам
 * (`/login`, `/setup`, `/invites/[token]/accept`), которые лежат вне
 * этой группы маршрутов.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<RequireAuth>
			<AppShell>{children}</AppShell>
		</RequireAuth>
	);
}
