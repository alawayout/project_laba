"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Pencil } from "lucide-react";
import { Button, Field, Toggle } from "@/components/ui";
import { useOrderDetail, useToaster } from "@/hooks";
import type { Technician, WorkStage, OrderFormValues } from "@/lib/types";
import { formatRub } from "@/lib/utils";
import { orderDetailToForm } from "@/lib/order-form";
import { OrderInfoPanel } from "./OrderInfoPanel";
import { OrderPhotos } from "./OrderPhotos";
import { OrderScheduleFields } from "./OrderScheduleFields";
import { StageList } from "./StageList";
import { ToothChart } from "./ToothChart";
import { OrderFormModal } from "./order-form/OrderFormModal";
import { FineModal } from "./modals/FineModal";
import { ReplaceTechModal } from "./modals/ReplaceTechModal";
import { ReportModal } from "./modals/ReportModal";

interface OrderDetailViewProps {
	orderId: string;
}

type ActiveModal = {
	type: "report" | "replace" | "fine";
	stage: WorkStage;
} | null;

export function OrderDetailView({ orderId }: Readonly<OrderDetailViewProps>) {
	const router = useRouter();
	const { notify } = useToaster();
	const detail = useOrderDetail(orderId);
	const [modal, setModal] = useState<ActiveModal>(null);
	const [editDraft, setEditDraft] = useState<OrderFormValues | null>(null);
	const { order } = detail;

	const goBack = () => router.push("/");

	if (!order) {
		return (
			<div className="py-24 text-center text-md text-fg-muted">
				Наряд не найден.{" "}
				<button onClick={goBack} className="text-accent underline">
					На главную
				</button>
			</div>
		);
	}

	const closeOrder = () => {
		notify(`Наряд №${order.number} закрыт`);
		window.setTimeout(goBack, 500);
	};

	const confirmReplace = (technician: Technician) => {
		if (modal) {
			detail.replaceTechnician(modal.stage.id, technician);
			notify(`Техник заменён: ${technician.short}`);
		}
		setModal(null);
	};

	const confirmFine = (amount: number) => {
		notify(`Штраф выписан · ${formatRub(amount)} ₽`, "warn");
		setModal(null);
	};

	return (
		<>
			<section
				style={{ animation: "labbor-view-in 0.32s ease" }}
				className="mx-auto max-w-[1480px]"
			>
				<div className="mb-6 flex items-center gap-3.5 pt-2">
					<button
						type="button"
						onClick={goBack}
						aria-label="На главную"
						className="flex h-12 w-12 items-center justify-center rounded-pill bg-surface-3 transition hover:bg-surface-4 md:h-[74px] md:w-[74px] [&>svg]:h-6 [&>svg]:w-6 md:[&>svg]:h-7 md:[&>svg]:w-7"
					>
						<Home />
					</button>
					<button
						type="button"
						onClick={goBack}
						aria-label="Назад"
						className="hidden h-10 w-10 items-center justify-center md:flex"
					>
						<ArrowLeft className="h-7 w-7" />
					</button>
					<h1 className="text-2xl font-semibold md:text-3xl">
						Просмотр наряда №{order.number}
					</h1>
					<button
						type="button"
						onClick={() => setEditDraft(orderDetailToForm(order))}
						aria-label="Редактировать наряд"
						className="ml-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-surface-3 transition hover:bg-surface-4 md:h-[52px] md:w-[52px] [&>svg]:h-5 [&>svg]:w-5 md:[&>svg]:h-6 md:[&>svg]:w-6"
					>
						<Pencil />
					</button>
				</div>

				<OrderInfoPanel order={order} />

				<div className="mb-5 flex flex-col gap-4 rounded-panel glass-soft p-5 md:p-6">
					<Field label="Вид работы" value={order.workType} locked />
					<ToothChart
						isSelected={detail.isToothSelected}
						onToggle={detail.toggleTooth}
						label={detail.teethLabel}
					/>
					<Field label="Цвет работы" value={order.color} locked />

					<StageList
						stages={detail.stages}
						editing={detail.editing}
						onReport={(stage) =>
							setModal({ type: "report", stage })
						}
						onReplace={(stage) =>
							setModal({ type: "replace", stage })
						}
						onFine={(stage) => setModal({ type: "fine", stage })}
					/>

					<OrderScheduleFields order={order} />

					<div className="flex items-center justify-between rounded-field bg-surface-5 px-5 py-3.5">
						<span className="text-md">Высокий приоритет</span>
						<Toggle
							checked={detail.priority}
							onChange={detail.setPriority}
							label="Высокий приоритет"
						/>
					</div>

					<Field
						alignTop
						label="Комментарий"
						value={order.comment}
						locked
					/>
					<OrderPhotos photos={order.photos} />
				</div>

				<div className="flex flex-col gap-4 sm:flex-row">
					<Button
						variant={detail.editing ? "lime" : "ghost"}
						onClick={detail.toggleEditing}
					>
						{detail.editing ? "Готово" : "Редактировать"}
					</Button>
					<Button onClick={closeOrder}>Закрыть наряд</Button>
				</div>
			</section>

			{modal?.type === "report" && (
				<ReportModal
					stage={modal.stage}
					workType={order.workType}
					onClose={() => setModal(null)}
				/>
			)}
			{modal?.type === "replace" && (
				<ReplaceTechModal
					stage={modal.stage}
					workType={order.workType}
					onClose={() => setModal(null)}
					onConfirm={confirmReplace}
				/>
			)}
			{modal?.type === "fine" && (
				<FineModal
					stage={modal.stage}
					orderNumber={order.number}
					workType={order.workType}
					onClose={() => setModal(null)}
					onConfirm={confirmFine}
				/>
			)}

			{editDraft && (
				<OrderFormModal
					mode="edit"
					initial={editDraft}
					onClose={() => setEditDraft(null)}
				/>
			)}
		</>
	);
}
