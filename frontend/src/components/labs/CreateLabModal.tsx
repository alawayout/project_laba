"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { useCreateLab } from "@/hooks/useCreateLab";
import { useToaster } from "@/hooks/useToaster";

interface CreateLabModalProps {
	onClose: () => void;
	/** Список лаб нужно перезагрузить сразу после создания (ссылка ещё показывается в модалке). */
	onCreated: () => void;
}

/** Форма создания лабы: название + данные владельца, которому уйдёт приглашение. */
export function CreateLabModal({ onClose, onCreated }: Readonly<CreateLabModalProps>) {
	const { notify } = useToaster();
	const [inviteUrl, setInviteUrl] = useState<string | null>(null);
	const { form, setField, submit, submitting } = useCreateLab((acceptUrl) => {
		onCreated();
		setInviteUrl(acceptUrl);
	});

	async function copyLink() {
		if (!inviteUrl) return;
		try {
			await navigator.clipboard.writeText(inviteUrl);
			notify("Ссылка скопирована", "ok");
		} catch {
			notify("Не удалось скопировать ссылку", "warn");
		}
	}

	if (inviteUrl) {
		return (
			<Modal title="Лаборатория создана" onClose={onClose}>
				<p className="text-md text-fg-secondary">
					Отправьте эту ссылку владельцу — по ней он задаст пароль и войдёт в свою лабораторию.
				</p>
				<div className="mt-3 truncate rounded-field bg-[#262626] px-4 py-3 text-caption text-fg-muted">
					{inviteUrl}
				</div>
				<div className="mt-5 flex gap-3">
					<Button variant="ghost" block onClick={() => void copyLink()}>
						Скопировать ссылку
					</Button>
					<Button block onClick={onClose}>
						Готово
					</Button>
				</div>
			</Modal>
		);
	}

	return (
		<Modal title="Новая лаборатория" onClose={onClose} size="lg">
			<form
				className="flex flex-col gap-3.5"
				onSubmit={(e) => {
					e.preventDefault();
					void submit();
				}}
			>
				<TextField
					label="Название лаборатории"
					value={form.labName}
					onChange={(v) => setField("labName", v)}
					placeholder="Дентал Люкс"
				/>
				<TextField
					label="Пробный период, дней"
					value={form.trialDays}
					onChange={(v) => setField("trialDays", v)}
					inputMode="numeric"
					placeholder="14"
				/>

				<div className="mt-1 border-t border-line pt-3.5 text-caption text-fg-muted">
					Владелец лаборатории
				</div>
				<TextField
					label="Email владельца"
					type="email"
					value={form.ownerEmail}
					onChange={(v) => setField("ownerEmail", v)}
					placeholder="owner@lab.local"
					autoComplete="email"
				/>
				<div className="grid grid-cols-2 gap-3.5">
					<TextField
						label="Имя"
						value={form.ownerFirstName}
						onChange={(v) => setField("ownerFirstName", v)}
						placeholder="Иван"
					/>
					<TextField
						label="Фамилия"
						value={form.ownerLastName}
						onChange={(v) => setField("ownerLastName", v)}
						placeholder="Иванов"
					/>
				</div>

				<Button type="submit" block className="mt-2" disabled={submitting}>
					{submitting ? "Создаём…" : "Создать лабораторию"}
				</Button>
			</form>
		</Modal>
	);
}
