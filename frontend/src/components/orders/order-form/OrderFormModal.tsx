"use client";

import { Plus } from "lucide-react";
import {
	Button,
	DashedButton,
	Modal,
	Select,
	TextField,
	Toggle,
	type SelectOption,
} from "@/components/ui";
import { ToothChart } from "../ToothChart";
import { StageAssignList } from "./StageAssignList";
import { ScheduleFields } from "./ScheduleFields";
import { PhotoUploader } from "./PhotoUploader";
import { useOrderForm, useToaster } from "@/hooks";
import { DOCTORS } from "@/lib/mocks/doctors";
import { workTypes } from "@/lib/mocks/work-types.mock";
import type { OrderFormMode, OrderFormValues } from "@/lib/types";
import HelpHint from "@/components/ui/HelpHint";

interface OrderFormModalProps {
	mode: OrderFormMode;
	initial: OrderFormValues;
	onClose: () => void;
}

/** Модалка создания/редактирования наряда. Логика — в useOrderForm. */
export function OrderFormModal({
	mode,
	initial,
	onClose,
}: Readonly<OrderFormModalProps>) {
	const form = useOrderForm(initial);
	const { notify } = useToaster();
	const { values } = form;

	const title =
		mode === "create"
			? "Новый наряд"
			: `Редактирование наряда №${values.number}`;
	const submitLabel = mode === "create" ? "Создать наряд" : "Сохранить";

	const doctorOptions: SelectOption[] = DOCTORS.map((d) => ({
		id: d.id,
		label: d.name,
	}));
	const workOptions: SelectOption[] = workTypes.map((w) => ({
		id: w.id,
		label: w.name,
	}));

	const submit = () => {
		if (!form.canSubmit) {
			notify("Заполните номер наряда и пациента", "warn");
			return;
		}
		notify(
			mode === "create"
				? `Наряд №${values.number} создан`
				: `Наряд №${values.number} сохранён`,
		);
		onClose();
	};

	return (
		<Modal
			title={title}
			onClose={onClose}
			size="lg"
			footer={
				<Button block onClick={submit}>
					{submitLabel}
				</Button>
			}
		>
			<div className="flex flex-col gap-3.5">
				<TextField
					label="Номер наряда"
					value={values.number}
					onChange={(v) => form.setField("number", v)}
					placeholder="000000"
					inputMode="numeric"
				/>
				<Select
					label="Врач"
					value={values.doctorId}
					options={doctorOptions}
					onChange={(id) => form.setField("doctorId", id)}
				/>
				<TextField
					label="Пациент"
					value={values.patient}
					onChange={(v) => form.setField("patient", v)}
					placeholder="ФИО пациента"
				/>
				<Select
					label="Вид работы"
					value={values.workTypeId}
					options={workOptions}
					onChange={(id) => form.changeWorkType(id)}
				/>

				<ToothChart
					isSelected={form.isToothSelected}
					onToggle={form.toggleTooth}
					label={form.teethLabel}
					onSelectArch={form.selectArch}
					onClear={form.clearTeeth}
				/>

				<TextField
					label="Цвет работы"
					value={values.color}
					onChange={(v) => form.setField("color", v)}
					placeholder="A-20, A-21"
				/>

				<StageAssignList
					stages={values.stages}
					onAssign={form.assignTechnician}
				/>

				<ScheduleFields
					due={values.due}
					onDue={form.setDue}
					fittings={values.fittings}
					onAddFitting={form.addFitting}
					onRemoveFitting={form.removeFitting}
					onSetFitting={form.setFitting}
				/>

				<div className="flex items-center justify-between rounded-field bg-[#262626] px-5 py-3.5">
					<div className="flex items-center gap-2.5">
						<span className="text-lg font-medium">
							Высокий приоритет
						</span>
						<HelpHint />
					</div>
					<Toggle
						checked={values.priority}
						onChange={form.togglePriority}
						label="Высокий приоритет"
					/>
				</div>

				<TextField
					label="Комментарий"
					value={values.comment}
					onChange={(v) => form.setField("comment", v)}
					placeholder="Особенности работы"
					multiline
				/>

				<PhotoUploader
					photos={values.photos}
					onAdd={form.addPhotos}
					onRemove={form.removePhoto}
				/>

				<DashedButton
					block
					icon={<Plus />}
					onClick={() =>
						notify(
							"Добавление ещё одного вида работы — в следующей итерации",
						)
					}
				>
					Добавить вид работы
				</DashedButton>
			</div>
		</Modal>
	);
}
