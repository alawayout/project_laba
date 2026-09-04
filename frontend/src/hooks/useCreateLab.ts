"use client";

import { useState } from "react";
import { createLab } from "@/lib/api/labs";
import { ApiRequestError } from "@/lib/api/client";
import { useToaster } from "@/hooks/useToaster";

export interface CreateLabFormState {
	labName: string;
	trialDays: string;
	ownerEmail: string;
	ownerFirstName: string;
	ownerLastName: string;
}

const EMPTY_FORM: CreateLabFormState = {
	labName: "",
	trialDays: "14",
	ownerEmail: "",
	ownerFirstName: "",
	ownerLastName: "",
};

/**
 * Стейт и сабмит формы создания лабы (лаба + пробная подписка + приглашение
 * владельцу). Тариф ("plan") в форме не показываем — на бэке это пока не
 * влияющая ни на что метка, бэк сам подставит значение по умолчанию.
 */
export function useCreateLab(onDone: (acceptUrl: string) => void) {
	const { notify } = useToaster();
	const [form, setForm] = useState<CreateLabFormState>(EMPTY_FORM);
	const [submitting, setSubmitting] = useState(false);

	function setField<K extends keyof CreateLabFormState>(key: K, value: CreateLabFormState[K]) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	async function submit() {
		if (
			!form.labName.trim() ||
			!form.ownerEmail.trim() ||
			!form.ownerFirstName.trim() ||
			!form.ownerLastName.trim()
		) {
			notify("Заполните название лабы и данные владельца", "warn");
			return;
		}

		const trialDays = Number(form.trialDays);
		setSubmitting(true);
		try {
			const result = await createLab({
				labName: form.labName.trim(),
				trialDays: Number.isFinite(trialDays) && trialDays > 0 ? trialDays : undefined,
				ownerEmail: form.ownerEmail.trim(),
				ownerFirstName: form.ownerFirstName.trim(),
				ownerLastName: form.ownerLastName.trim(),
			});
			notify(`Лаборатория «${result.lab.name}» создана`, "ok");
			setForm(EMPTY_FORM);
			onDone(result.invite.acceptUrl);
		} catch (error) {
			notify(
				error instanceof ApiRequestError ? error.message : "Не удалось создать лабораторию",
				"warn",
			);
		} finally {
			setSubmitting(false);
		}
	}

	return { form, setField, submit, submitting };
}
