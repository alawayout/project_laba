"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface BlockLabModalProps {
	labName: string;
	onClose: () => void;
	onConfirm: () => Promise<boolean>;
}

/** Подтверждение блокировки лабы (мягкое удаление — обратимо через восстановление). */
export function BlockLabModal({ labName, onClose, onConfirm }: Readonly<BlockLabModalProps>) {
	const [submitting, setSubmitting] = useState(false);

	async function handleConfirm() {
		setSubmitting(true);
		const ok = await onConfirm();
		setSubmitting(false);
		if (ok) onClose();
	}

	return (
		<Modal title="Заблокировать лабораторию" onClose={onClose}>
			<p className="text-md text-fg-secondary">
				«{labName}» будет немедленно заблокирована: все сотрудники разлогинятся и не смогут
				войти, пока доступ не будет восстановлен. Сотрудники, история их действий и приглашения
				не удаляются — восстановить лабораторию можно в любой момент.
			</p>
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
					{submitting ? "Блокируем…" : "Заблокировать"}
				</Button>
			</div>
		</Modal>
	);
}
