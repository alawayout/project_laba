import { DayTask } from "../types/task";

/** Расписание задач на день для дашборда. */
export const DAY_TASKS: DayTask[] = [
	{
		id: "t-0900",
		time: "09:00",
		label: "Попить кофе",
		color: "lime",
		done: false,
	},
	{
		id: "t-1000",
		time: "10:00",
		label: "Подготовить документы, отвезти в налоговую",
		color: "blue",
		done: true,
	},
	{
		id: "t-1030",
		time: "10:30",
		label: "Забрать посылку из БьютиМед",
		color: "purple",
		done: false,
	},
	{
		id: "t-1100",
		time: "11:00",
		label: "Отправить работы в стоматологию",
		color: "blue",
		done: false,
	},
	{
		id: "t-1200",
		time: "12:00",
		label: "Время обеда",
		color: "lime",
		done: false,
	},
	{
		id: "t-1500",
		time: "15:00",
		label: "Подготовить документы, отвезти в налоговую",
		color: "blue",
		done: false,
		upcoming: true,
	},
	{
		id: "t-1730",
		time: "17:30",
		label: "Забрать посылку из БьютиМед",
		color: "purple",
		done: false,
		upcoming: true,
	},
];
