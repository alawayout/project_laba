"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, Flame } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { useToaster } from "@/hooks/useToaster";
import { cn } from "@/lib/utils";
import { OrderSummary } from "@/lib/types/order";

interface MetaProps {
	label: string;
	value: string;
}

function Meta({ label, value }: MetaProps) {
	return (
		<div className="min-w-0">
			<div className="mb-1 text-caption text-fg-muted">{label}</div>
			<div className="truncate text-base font-medium">{value}</div>
		</div>
	);
}

interface WorkOrderCardProps {
	order: OrderSummary;
	className?: string;
}

/** Карточка наряда на доске «В работе»: врач, метаданные, действия. */
export function WorkOrderCard({ order, className }: WorkOrderCardProps) {
	const router = useRouter();
	const { notify } = useToaster();

	return (
		<article
			className={cn(
				"flex flex-col rounded-card border border-white/[0.06] bg-[#070707] p-5",
				className,
			)}
		>
			<div className="mb-4 flex items-center justify-end gap-2">
				{order.urgent ? (
					<span className="inline-flex items-center gap-1.5 rounded-pill bg-[#3d2a16] px-3 py-[7px] text-caption font-semibold text-[#ff9a52]">
						<Flame className="size-3.5" />
						Срочно
					</span>
				) : null}
				<Badge status={order.status} />
			</div>

			<div className="mb-5 flex items-start justify-between gap-3">
				<div className="flex min-w-0 items-center gap-3">
					<Avatar src={null} alt={order.doctor} size={42} />
					<div className="min-w-0">
						<div className="text-caption text-fg-muted">Врач</div>
						<div className="truncate text-base font-medium">
							{order.doctor}
						</div>
					</div>
				</div>
				<div className="shrink-0 text-right">
					<div className="text-caption text-fg-muted">
						{order.fittingLabel}
					</div>
					<div className="text-base font-medium">{order.number}</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-x-3 gap-y-4">
				<Meta label="Пациент" value={order.patient} />
				<Meta label="Примерка 1" value={order.fittingLabel} />
				<Meta label="Техник" value={order.technician} />
				<Meta label="Примерка 2" value="—" />
				<Meta label="Вид работы" value={order.workType} />
				<Meta label="Дата сдачи" value={order.dueLabel} />
			</div>

			<div className="mt-5 flex items-center gap-3">
				<Button
					className="flex-1"
					onClick={() => notify(`Наряд №${order.number} закрыт`)}
				>
					Закрыть наряд
				</Button>
				<IconButton
					label="Открыть наряд"
					onClick={() => router.push(`/orders/${order.id}`)}
				>
					<ArrowUpRight />
				</IconButton>
			</div>
		</article>
	);
}
