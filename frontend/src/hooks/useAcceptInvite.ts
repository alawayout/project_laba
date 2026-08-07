"use client";

import { useState } from "react";
import { acceptInvite } from "@/lib/api/invites";
import { ApiRequestError } from "@/lib/api/client";
import { useToaster } from "@/hooks/useToaster";

export interface AcceptInviteForm {
	password: string;
	confirmPassword: string;
	firstName: string;
	lastName: string;
}

const EMPTY_FORM: AcceptInviteForm = {
	password: "",
	confirmPassword: "",
	firstName: "",
	lastName: "",
};

const MIN_PASSWORD_LENGTH = 8;

/** Стейт и сабмит формы принятия приглашения. `needsProfile` — новый ли это аккаунт. */
export function useAcceptInvite(token: string, needsProfile: boolean) {
	const { notify } = useToaster();
	const [form, setForm] = useState<AcceptInviteForm>(EMPTY_FORM);
	const [submitting, setSubmitting] = useState(false);
	const [done, setDone] = useState(false);

	function setField<K extends keyof AcceptInviteForm>(key: K, value: AcceptInviteForm[K]) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	function validate(): string | null {
		if (!needsProfile) return null;
		if (form.password.length < MIN_PASSWORD_LENGTH) return "Пароль должен быть не короче 8 символов";
		if (form.password !== form.confirmPassword) return "Пароли не совпадают";
		if (!form.firstName.trim() || !form.lastName.trim()) return "Укажите имя и фамилию";
		return null;
	}

	async function submit() {
		const validationError = validate();
		if (validationError) {
			notify(validationError, "warn");
			return;
		}

		setSubmitting(true);
		try {
			await acceptInvite(token, needsProfile ? {
				password: form.password,
				firstName: form.firstName.trim(),
				lastName: form.lastName.trim(),
			} : {});
			setDone(true);
			notify("Приглашение принято", "ok");
		} catch (error) {
			const message =
				error instanceof ApiRequestError ? error.message : "Не удалось принять приглашение";
			notify(message, "warn");
		} finally {
			setSubmitting(false);
		}
	}

	return { form, setField, submit, submitting, done };
}
