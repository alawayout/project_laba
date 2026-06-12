import {
  FolderOpen,
  LayoutGrid,
  LineChart,
  Wallet,
  FileText,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  implemented: boolean;
}

/** Primary navigation. Only "Наряды" is wired in this slice. */
export const NAV_ITEMS: NavItem[] = [
  { id: "orders", label: "Наряды", icon: LayoutGrid, href: "/", implemented: true },
  { id: "stats", label: "Аналитика", icon: LineChart, implemented: false },
  { id: "salary", label: "Зарплаты", icon: Wallet, implemented: false },
  { id: "works", label: "Виды работ", icon: FileText, implemented: false },
  { id: "docs", label: "Документы", icon: FolderOpen, implemented: false },
];
