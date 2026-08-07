import type { ReactNode } from "react";
import { AppShell } from "@/components/layout";

/** Внутренний контур приложения — рейл + топбар. Не применяется к public-страницам. */
export default function DashboardLayout({ children }: { children: ReactNode }) {
	return <AppShell>{children}</AppShell>;
}
