import { Delivery } from "../types/delivery";

/** Доставки нарядов курьерами. */
export const DELIVERIES: Delivery[] = [
	{
		id: "d-205641",
		lab: "Бьютимед",
		courier: "Мищенко Сергей",
		payAmount: 250,
		payStatus: "to-pay",
		dateTime: "22.07.2026 в 11:20",
		orderNum: "205641",
		photo: "view",
	},
	{
		id: "d-205642",
		lab: "Эстетика смайл",
		courier: null,
		payAmount: null,
		payStatus: null,
		dateTime: "22.07.2026 в 11:20",
		orderNum: "205641",
		photo: "attach",
	},
	{
		id: "d-205643",
		lab: "ДентаЛюкс",
		courier: "Орлова Анна",
		payAmount: 400,
		payStatus: "paid",
		dateTime: "23.07.2026 в 09:40",
		orderNum: "205702",
		photo: "view",
	},
];
