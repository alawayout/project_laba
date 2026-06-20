"use client";

import { useState } from "react";
import { StatItem } from "./StatItem";
import { AddOrderButton } from "./AddOrderButton";
import { OrderFormModal } from "./order-form/OrderFormModal";
import { DASHBOARD_STATS } from "@/lib/mocks/stats";
import { createEmptyOrderForm } from "@/lib/order-form";
import type { OrderFormValues } from "@/lib/types";

/** Шапка дашборда: «Добавить наряд» + ряд метрик. */
export function DashboardHeader() {
	const [draft, setDraft] = useState<OrderFormValues | null>(null);

	return (
		<div className="mb-6 mt-4 flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
			<AddOrderButton onClick={() => setDraft(createEmptyOrderForm())} />
			<div className="flex flex-wrap gap-x-[46px] gap-y-4">
				{DASHBOARD_STATS.map((stat) => (
					<StatItem key={stat.id} stat={stat} />
				))}
			</div>

			{draft && (
				<OrderFormModal
					mode="create"
					initial={draft}
					onClose={() => setDraft(null)}
				/>
			)}
		</div>
	);
}
