"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";
import { DayTasksPanel } from "@/components/tasks/DayTasksPanel";
import { DeliveriesPanel } from "@/components/deliveries/DeliveriesPanel";
import { useDashboardOrders } from "@/hooks/useDashboardOrders";
import { useToaster } from "@/hooks/useToaster";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/orders/DashboardHeader";
import { WorkOrderCard } from "@/components/orders/WorkOrderCard/WorkOrderCard";
import {
	BoardFilter,
	BoardHeader,
	BoardView,
} from "@/components/orders/BoardHeader";
import { AppShell } from "../layout";

const INITIAL_FILTERS: BoardFilter[] = [
	{ id: "f-1", name: "Завадский Женя" },
	{ id: "f-2", name: "Колбин Сергей" },
];

/** Главная страница: метрики, доска «В работе», задачи и доставки. */
export default function OrdersPage() {
	const orders = useDashboardOrders();
	const { notify } = useToaster();
	const [view, setView] = useState<BoardView>("row");
	const [filters, setFilters] = useState<BoardFilter[]>(INITIAL_FILTERS);

	const removeFilter = (id: string) =>
		setFilters((list) => list.filter((f) => f.id !== id));
	const addFilter = () =>
		notify("Выбор техника для фильтра — в следующей итерации");

	return (
		<AppShell>
			<div className="anim-view">
				<DashboardHeader />

				<BoardHeader
					filters={filters}
					onRemoveFilter={removeFilter}
					onAddFilter={addFilter}
					view={view}
					onViewChange={setView}
				/>

				{orders.length ? (
					<div
						className={cn(
							"pt-6 pb-2",
							view === "row"
								? "flex flex-col gap-5 sm:flex-row sm:overflow-x-auto sm:overflow-y-visible"
								: "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3",
						)}
					>
						{orders.map((order) => (
							<WorkOrderCard
								key={order.id}
								order={order}
								className={
									view === "row"
										? "w-full sm:w-120 sm:shrink-0"
										: "w-full"
								}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center gap-3.5 py-30 text-fg-muted">
						<SearchX className="size-12" />
						<p className="text-md">Наряды не найдены</p>
					</div>
				)}

				<div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-2">
					<DayTasksPanel />
					<DeliveriesPanel />
				</div>
			</div>
		</AppShell>
	);
}
