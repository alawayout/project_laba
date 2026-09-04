"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import type { LabSummary, UpdateLabInput } from "@/lib/api/labs";

interface EditLabModalProps {
	lab: LabSummary;
	onClose: () => void;
	onConfirm: (input: UpdateLabInput) => Promise<boolean>;
}

const DATE_FMT = new Intl.DateTimeFormat("ru-RU", {
	day: "numeric",
	month: "long",
	year: "numeric",
});

/** input[type=date] ждёт ровно YYYY-MM-DD. */
function toDateInputValue(iso: string): string {
	return iso.slice(0, 10);
}

/** Переименование лабы и ручная правка даты окончания подписки. */
export function EditLabModal({ lab, onClose, onConfirm }: Readonly<EditLabModalProps>) {
	const [name, setName] = useState(lab.name);
	const [expiresAt, setExpiresAt] = useState(
		lab.subscription ? toDateInputValue(lab.subscription.expiresAt) : "",
	);
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit() {
		const input: UpdateLabInput = {};
		if (name.trim() && name.trim() !== lab.name) input.name = name.trim();
		if (
			expiresAt &&
			expiresAt !== (lab.subscription ? toDateInputValue(lab.subscription.expiresAt) : "")
		) {
			input.expiresAt = expiresAt;
		}

		if (Object.keys(input).length === 0) {
			onClose();
			return;
		}

		setSubmitting(true);
		const ok = await onConfirm(input);
		setSubmitting(false);
		if (ok) onClose();
	}

	return (
		<Modal title="Изменить лабораторию" onClose={onClose}>
			<p className="text-caption text-fg-muted">
				Зарегистрирована {DATE_FMT.format(new Date(lab.createdAt))}
			</p>
			<form
				className="mt-3.5 flex flex-col gap-3.5"
				onSubmit={(e) => {
					e.preventDefault();
					void handleSubmit();
				}}
			>
				<TextField label="Название" value={name} onChange={setName} />
				<TextField
					label="Подписка активна до"
					type="date"
					value={expiresAt}
					onChange={setExpiresAt}
				/>
				<Button type="submit" block className="mt-2" disabled={submitting}>
					{submitting ? "Сохраняем…" : "Сохранить"}
				</Button>
			</form>
		</Modal>
	);
}
