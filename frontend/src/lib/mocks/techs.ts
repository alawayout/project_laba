import { Tech } from "../types/tech";

export const TECHS: Tech[] = [
  {
    id: "darius",
    name: "Дариуш Мария Владимировна",
    short: "Дариуш М. В.",
    category: "2 категория",
    avatar: "/assets/avatar-tech.png",
  },
  {
    id: "kolbin",
    name: "Колбин Сергей Александрович",
    short: "Колбин С. А.",
    category: "3 категория",
    avatar: null,
  },
  {
    id: "markova",
    name: "Маркова Светлана Алексеевна",
    short: "Маркова С. А.",
    category: "3 категория",
    avatar: null,
  },
];

export const getTech = (id: string): Tech | undefined =>
  TECHS.find((t) => t.id === id);
