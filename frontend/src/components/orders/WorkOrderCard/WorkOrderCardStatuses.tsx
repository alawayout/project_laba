import { OrderSummary } from "@/lib/types/order";
import { Flame } from "lucide-react";
import { Badge } from "../../ui/Badge";

interface WorkOrderCardStatusesProps {
	order: OrderSummary;
}

export default function WorkOrderCardStatuses({
	order,
}: WorkOrderCardStatusesProps) {
	return (
		<div
			className="
					absolute
					left-1/2
					-top-5
					w-full
					z-20

					flex
					-translate-x-1/2
					items-center
					justify-end
					gap-2
				"
		>
			{order.status === "dead" && (
				<div
					className="
							flex
							items-center
							gap-1.5

							rounded-full

							border
							border-orange-400/20

							bg-[#2b2114]/95

							px-3
							py-1.5

							backdrop-blur-xl
						"
				>
					<Flame size={12} className="text-orange-400" />

					<span className="text-sm font-medium text-orange-300">
						2 дня
					</span>
				</div>
			)}

			<Badge status={order.status} />
		</div>
	);
}
