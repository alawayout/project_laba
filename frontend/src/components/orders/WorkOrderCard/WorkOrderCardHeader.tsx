import { Avatar } from "@/components/ui";
import { OrderSummary } from "@/lib/types/order";

interface WorkOrderCardHeaderProps {
	order: OrderSummary;
}

export default function WorkOrderCardHeader({
	order,
}: Readonly<WorkOrderCardHeaderProps>) {
	return (
		<div className="mb-6 flex items-start justify-between gap-4">
			<div className="flex min-w-0 items-center gap-3">
				<Avatar
					src="/avatars/avatar-tech.png"
					alt={order.doctor}
					size={56}
				/>

				<div className="min-w-0">
					<div className="text-sm text-white/55">Врач</div>

					<div className="text-xl font-medium text-white">
						{order.doctor}
					</div>
				</div>
			</div>

			<div className="shrink-0 text-right">
				<div className="text-sm text-white/55">13.05.2024</div>

				<div className="text-[22px] font-medium text-white">
					{order.number}
				</div>
			</div>
		</div>
	);
}
