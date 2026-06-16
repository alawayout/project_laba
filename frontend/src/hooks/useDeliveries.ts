"use client";

import { DELIVERIES } from "@/lib/mocks/deliveries";
import { Delivery, DeliveryRange } from "@/lib/types/delivery";
import { useMemo, useState } from "react";

interface UseDeliveries {
	range: DeliveryRange;
	setRange: (range: DeliveryRange) => void;
	deliveries: Delivery[];
}

/** Доставки с переключением окна «Неделя / День». */
export function useDeliveries(): UseDeliveries {
	const [range, setRange] = useState<DeliveryRange>("week");

	// День показывает только ближайшую доставку (поведение мока).
	const deliveries = useMemo<Delivery[]>(
		() => (range === "day" ? DELIVERIES.slice(0, 1) : DELIVERIES),
		[range],
	);

	return { range, setRange, deliveries };
}
