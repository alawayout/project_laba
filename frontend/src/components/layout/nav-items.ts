import {
	FolderOpen,
	LineChart,
	Wallet,
	FileText,
	HomeIcon,
	type LucideIcon,
} from "lucide-react";

export interface NavItem {
	id: string;
	label: string;
	icon: LucideIcon;
	href?: string;
	implemented: boolean;
}

/** Primary navigation. */
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
	{ id: "docs", label: "Документы", icon: FolderOpen, implemented: false },
];
