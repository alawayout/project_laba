import {
	Building2,
	FolderOpen,
	LineChart,
	Users,
	Wallet,
	FileText,
	HomeIcon,
	type LucideIcon,
} from "lucide-react";
import type { LabRole } from "@/lib/api/invites";
import type { AccessTokenPayload } from "@/lib/auth/tokenStorage";

export interface NavItem {
	id: string;
	label: string;
	icon: LucideIcon;
	href?: string;
	implemented: boolean;
	/**
	 * Ограничение по роли внутри лабы. Не задано — доступно любой роли
	 * сотрудника лабы (но не платформенному админу — см. superAdminOnly).
	 */
	roles?: LabRole[];
	/** Доступно только платформенному администратору (сессия без своей лабы). */
	superAdminOnly?: boolean;
}

/** Primary navigation. Видимость по роли фильтруется в NavRail. */
export const NAV_ITEMS: NavItem[] = [
	{
		id: "orders",
		label: "Наряды",
		icon: HomeIcon,
		href: "/",
		implemented: true,
	},
	{
		id: "stats",
		label: "Аналитика",
		icon: LineChart,
		href: "/analytics",
		implemented: true,
	},
	{
		id: "salary",
		label: "Зарплаты",
		icon: Wallet,
		href: "/salary",
		implemented: true,
	},
	{
		id: "works",
		label: "Виды работ",
		icon: FileText,
		href: "/work-types",
		implemented: true,
	},
	{
		id: "employees",
		label: "Сотрудники",
		icon: Users,
		href: "/employees",
		implemented: true,
		// Управлять сотрудниками может только владелец и администратор лабы —
		// см. MANAGE_PERMISSIONS на бэке (src/common/constants/lab-permissions.ts).
		roles: ["OWNER", "ADMIN"],
	},
	{ id: "docs", label: "Документы", icon: FolderOpen, implemented: false },
	{
		id: "labs",
		label: "Лаборатории",
		icon: Building2,
		href: "/labs",
		implemented: true,
		superAdminOnly: true,
	},
];


/**
 * Реальная (серверная) проверка прав — всегда в guard'ах бэка; здесь только
 * UI-фильтр, чтобы не показывать ссылки, куда пользователю всё равно не дадут
 * зайти. Платформенный админ работает вне контекста лабы — видит только свои
 * (superAdminOnly) пункты; сотрудник лабы — свои лаб-пункты, отфильтрованные
 * по roles, и никогда не видит superAdminOnly-пункты.
 */
export function isNavItemVisible(item: NavItem, session: AccessTokenPayload | null): boolean {
	if (item.superAdminOnly) {
		return !!session?.isSuperAdmin;
	}
	if (session?.isSuperAdmin) {
		return false;
	}
	if (item.roles && item.roles.length > 0) {
		return !!session?.role && item.roles.includes(session.role);
	}
	return true;
}

/**
 * Первый доступный текущей сессии пункт навигации (по порядку в NAV_ITEMS) —
 * куда вести пользователя сразу после входа вместо захардкоженного "/",
 * который для платформенного админа указывает на нерелевантный ему макет
 * главной страницы. Для обычного сотрудника лабы первый пункт — как и
 * раньше, "/" (Наряды); для платформенного админа — "/labs".
 */
export function getDefaultRoute(session: AccessTokenPayload | null): string {
	const item = NAV_ITEMS.find(
		(candidate) => candidate.implemented && candidate.href && isNavItemVisible(candidate, session),
	);
	return item?.href ?? "/login";
}
