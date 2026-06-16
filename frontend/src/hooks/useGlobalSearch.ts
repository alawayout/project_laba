"use client";

import { useMemo } from "react";
import { useSearchQuery } from "./useSearchQuery";
import { matchesQuery } from "@/lib/search";
import { OrderSummary } from "@/lib/types";
import { orders as ORDERS } from "@/lib/mocks/orders.mock";
import { TECHS } from "@/lib/mocks/techs";
import { Tech } from "@/lib/types/tech";
import { DOCTORS } from "@/lib/mocks/doctors";
import { Doctor } from "@/lib/types/doctor";

/** Сгруппированная по сущностям выдача глобального поиска. */
export interface GlobalSearchResult {
	query: string;
	hasQuery: boolean;
	orders: OrderSummary[];
	techs: Tech[];
	doctors: Doctor[];
	total: number;
}

/** Мульти-поиск по нарядам, техникам и врачам по строке из шапки. */
export function useGlobalSearch(): GlobalSearchResult {
	const { query } = useSearchQuery();

	return useMemo<GlobalSearchResult>(() => {
		const q = query.trim();
		if (!q) {
			return {
				query,
				hasQuery: false,
				orders: [],
				techs: [],
				doctors: [],
				total: 0,
			};
		}

		const orders = ORDERS.filter((o) =>
			[o.number, o.workType, o.doctor, o.patient, o.technician].some(
				(f) => matchesQuery(f, q),
			),
		);
		const techs = TECHS.filter((t) =>
			[t.name, t.short, t.category].some((f) => matchesQuery(f, q)),
		);
		const doctors = DOCTORS.filter((d) =>
			[d.name, d.short, d.clinic].some((f) => matchesQuery(f, q)),
		);

		return {
			query,
			hasQuery: true,
			orders,
			techs,
			doctors,
			total: orders.length + techs.length + doctors.length,
		};
	}, [query]);
}
