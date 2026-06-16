"use client";

import { cn } from "@/lib/utils";
import { OrderSummary } from "@/lib/types/order";
import WorkOrderCardStatuses from "../WorkOrderCard/WorkOrderCardStatuses";
import WorkOrderCardFooter from "../WorkOrderCard/WorkOrderCardFooter";
import WorkOrderCardHeader from "./WorkOrderCardHeader";
import Meta from "./Meta";

interface WorkOrderCardProps {
	order: OrderSummary;
	className?: string;
}

export function WorkOrderCard({
	order,
	className,
}: Readonly<WorkOrderCardProps>) {
	return (
		<article
			className={cn(
				`
				relative
				flex
				flex-col
				overflow-visible

				rounded-4xl
				border
				border-transparent

				backdrop-blur-[116px]

				shadow-[0_20px_60px_rgba(0,0,0,0.45)]

				p-4 pt-8
				sm:p-5 sm:pt-10

				before:pointer-events-none
				before:absolute
				before:inset-0
				before:-z-10
				before:rounded-4xl
				before:bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08),transparent_70%)]
				`,
				className,
			)}
			style={{
				background: `
					linear-gradient(rgba(28,28,28,0.79), rgba(28,28,28,0.79)) padding-box,
					linear-gradient(to bottom, #585858, #232323, #585858) border-box
				`,
			}}
		>
			{/* Статусы поверх карточки */}
			<WorkOrderCardStatuses order={order} />

			{/* Header */}
			<WorkOrderCardHeader order={order} />

			{/* Контент */}
			<div
				className="
					flex-1
					grid
					grid-cols-2
					gap-x-6
					gap-y-5
				"
			>
				<Meta label="Пациент" value={order.patient} />
				<Meta label="Примерка 1" value={order.fittingLabel} />
				<Meta label="Техник" value={order.technician} />
				<Meta label="Примерка 2" value="17.05.2024 | 14:20" />
				<Meta label="Вид работы" value={order.workType} />
				<Meta label="Дата сдачи" value={order.dueLabel} />
			</div>

			{/* Footer */}
			<WorkOrderCardFooter orderId={order.id} />
		</article>
	);
}
