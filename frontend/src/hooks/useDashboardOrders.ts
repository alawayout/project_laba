"use client";

import { useMemo } from "react";
import { useSearchQuery } from "./useSearchQuery";
import { OrderSummary } from "@/lib/types/order";
import { orders as ORDERS } from "@/lib/mocks/orders.mock";

/** Список нарядов дашборда, отфильтрованный по строке поиска из шапки. */
export function useDashboardOrders(): OrderSummary[] {
	const { query } = useSearchQuery();

	return useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return ORDERS;
		return ORDERS.filter((order) =>
			[
				order.number,
				order.workType,
				order.doctor,
				order.patient,
				order.technician,
			].some((field) => field.toLowerCase().includes(q)),
		);
	}, [query]);
}
