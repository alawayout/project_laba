import { Doctor } from "../types/doctor";

export const DOCTORS: Doctor[] = [
	{
		id: "tikus",
		name: "Тикус Сергей Александрович",
		short: "Тикус С. А.",
		clinic: "Бьютимед",
		avatar: null,
	},
	{
		id: "smolin",
		name: "Смолин Виктор Петрович",
		short: "Смолин В. П.",
		clinic: "Эстетика смайл",
		avatar: null,
	},
];

export const getDoctor = (id: string): Doctor | undefined =>
	DOCTORS.find((d) => d.id === id);
