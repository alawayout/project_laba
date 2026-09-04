"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

interface RemoveEmployeeModalProps {
	employeeName: string;
	onClose: () => void;
	onConfirm: (reason: string | undefined) => Promise<boolean>;
}

/** Подтверждение увольнения (мягкое удаление) с опциональной причиной. */
export function RemoveEmployeeModal({
	employeeName,
	onClose,
	onConfirm,
}: Readonly<RemoveEmployeeModalProps>) {
	const [reason, setReason] = useState("");
	const [submitting, setSubmitting] = useState(false);

	async function handleConfirm() {
		setSubmitting(true);
		const ok = await onConfirm(reason.trim() || undefined);
		setSubmitting(false);
		if (ok) onClose();
	}

	return (
		<Modal title="Уволить сотрудника" onClose={onClose}>
			<p className="text-md text-fg-secondary">
				«{employeeName}» будет отмечен как уволенный. Доступ отзывается сразу, история его
				действий сохраняется — восстановить можно в любой момент из архива.
			</p>
			<div className="mt-4">
				<TextField
					label="Причина (необязательно)"
					value={reason}
					onChange={setReason}
					placeholder="Например: по собственному желанию"
					multiline
					tone="modal"
				/>
			</div>
			<div className="mt-5 flex gap-3">
				<Button variant="ghost" block onClick={onClose} disabled={submitting}>
					Отмена
				</Button>
				<Button
					variant="lime"
					block
					className="bg-dead text-dead-fg hover:brightness-110"
					onClick={() => void handleConfirm()}
					disabled={submitting}
				>
					{submitting ? "Увольняем…" : "Уволить"}
				</Button>
			</div>
		</Modal>
	);
}
