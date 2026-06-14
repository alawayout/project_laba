import { ArrowUpRight, CreditCard, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToaster } from "@/hooks/useToaster";
import { formatMoney } from "@/lib/format";
import { Delivery } from "@/lib/types/delivery";

interface RowProps {
	label: string;
	children: React.ReactNode;
}

function Row({ label, children }: RowProps) {
	return (
		<div className="flex items-center justify-between gap-3 text-base">
			<span className="text-fg-muted">{label}</span>
			<span className="font-medium">{children}</span>
		</div>
	);
}

interface DeliveryCardProps {
	delivery: Delivery;
}

/** Карточка доставки: лаборатория, курьер, оплата, метаданные. */
export function DeliveryCard({ delivery }: DeliveryCardProps) {
	const { notify } = useToaster();
	const paid = delivery.payStatus === "paid";

	return (
		<article className="rounded-card bg-surface-3 p-5">
			<div className="flex items-center gap-3 text-base">
				<span className="text-fg-muted">Лаборатория</span>
				<span className="flex-1 border-b border-dashed border-white/15" />
				<span className="font-medium">{delivery.lab}</span>
			</div>

			<div className="mt-4 flex flex-col gap-3 rounded-image bg-surface-4 p-4">
				<div className="flex items-center gap-3">
					<span className="flex size-10 items-center justify-center rounded-xl bg-surface-5 text-fg-tertiary [&_svg]:size-5">
						<Package />
					</span>
					<div className="min-w-0">
						<div className="text-caption text-fg-muted">курьер</div>
						<div className="truncate text-base font-medium">
							{delivery.courier ?? "—"}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<span className="flex size-10 items-center justify-center rounded-xl bg-surface-5 text-fg-tertiary [&_svg]:size-5">
						<CreditCard />
					</span>
					<div className="min-w-0">
						<div className="text-caption text-fg-muted">оплата</div>
						<div className="text-base font-medium">
							{delivery.payAmount !== null
								? formatMoney(delivery.payAmount)
								: "—"}
						</div>
					</div>
					{delivery.payStatus === "to-pay" ? (
						<button
							type="button"
							onClick={() =>
								notify("Оплата доставки — в следующей итерации")
							}
							className="ml-auto rounded-pill bg-accent px-4 py-2 text-caption font-semibold text-black"
						>
							оплатить
						</button>
					) : paid ? (
						<span className="ml-auto rounded-pill bg-surface-5 px-4 py-2 text-caption font-medium text-fg-muted">
							оплачено
						</span>
					) : null}
				</div>
			</div>

			<div className="mt-4 flex flex-col gap-2.5">
				<Row label="Дата и время">{delivery.dateTime}</Row>
				<Row label="Наряд">
					<span className="inline-flex items-center gap-1">
						{delivery.orderNum}
						<ArrowUpRight className="size-4 text-fg-muted" />
					</span>
				</Row>
				<Row label="Фото посылки">
					{delivery.photo === "view" ? (
						<span className="rounded-pill bg-surface-5 px-3.5 py-1.5 text-caption text-fg-secondary">
							посмотреть
						</span>
					) : (
						<span className="rounded-pill bg-accent px-3.5 py-1.5 text-caption font-semibold text-black">
							прикрепить
						</span>
					)}
				</Row>
			</div>

			<div className="mt-4 flex justify-center">
				<Button
					variant="ghost"
					onClick={() =>
						notify(
							`Доставка №${delivery.orderNum} — редактирование`,
						)
					}
				>
					Редактировать
				</Button>
			</div>
		</article>
	);
}
