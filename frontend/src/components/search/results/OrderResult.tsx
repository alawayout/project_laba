import Link from "next/link";
import { Highlight } from "@/components/ui/Highlight";
import type { OrderSummary } from "@/lib/types/order";

interface FieldProps {
	label: string;
	value: string;
	query: string;
}

function Field({ label, value, query }: FieldProps) {
	return (
		<div className="min-w-0">
			<div className="text-caption text-fg-muted">{label}</div>
			<div className="truncate text-base">
				<Highlight text={value} query={query} />
			</div>
		</div>
	);
}

interface OrderResultProps {
	order: OrderSummary;
	query: string;
	onNavigate: () => void;
}

/** Строка-результат наряда → переход на /orders/[id]. */
export function OrderResult({ order, query, onNavigate }: OrderResultProps) {
	return (
		<Link
			href={`/orders/${order.id}`}
			onClick={onNavigate}
			className="block rounded-2xl px-2.5 py-3 transition hover:bg-white/[0.06]"
		>
			<div className="mb-2.5 text-base font-semibold">
				<Highlight text={order.workType} query={query} />
			</div>
			<div className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-[1fr_1fr_1fr_auto]">
				<Field label="Врач" value={order.doctor} query={query} />
				<Field label="Пациент" value={order.patient} query={query} />
				<Field label="Техник" value={order.technician} query={query} />
				<div className="min-w-0 text-right sm:text-left">
					<div className="text-caption text-fg-muted">
						<Highlight text={order.dueLabel ?? ""} query={query} />
					</div>
					<div className="text-base">
						<Highlight text={order.number} query={query} />
					</div>
				</div>
			</div>
		</Link>
	);
}
