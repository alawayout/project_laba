import type { Technician } from "@/lib/types";

export const technicians: Technician[] = [
  {
    id: "tech-darius",
    name: "Дариуш Мария Владимировна",
    short: "Дариуш М. В.",
    category: "2 категория",
    avatarUrl: "/avatars/avatar-tech.png",
  },
  {
    id: "tech-kolbin",
    name: "Колбин Сергей Александрович",
    short: "Колбин С. А.",
    category: "3 категория",
    avatarUrl: null,
  },
  {
    id: "tech-markova",
    name: "Маркова Светлана Алексеевна",
    short: "Маркова С. А.",
    category: "3 категория",
    avatarUrl: null,
  },
];

export function getTechnicianById(id: string): Technician | undefined {
  return technicians.find((t) => t.id === id);
}
