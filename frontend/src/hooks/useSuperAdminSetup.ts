"use client";

import { useState } from "react";
import { createSuperAdmin } from "@/lib/api/setup";
import { ApiRequestError } from "@/lib/api/client";
import { useToaster } from "@/hooks/useToaster";

export interface SuperAdminSetupForm {
	email: string;
	password: string;
	confirmPassword: string;
	firstName: string;
	lastName: string;
}

const EMPTY_FORM: SuperAdminSetupForm = {
	email: "",
	password: "",
	confirmPassword: "",
	firstName: "",
	lastName: "",
};

const MIN_PASSWORD_LENGTH = 8;

/** Стейт и сабмит формы создания первого платформенного администратора. */
export function useSuperAdminSetup() {
	const { notify } = useToaster();
	const [form, setForm] = useState<SuperAdminSetupForm>(EMPTY_FORM);
	const [submitting, setSubmitting] = useState(false);
	const [done, setDone] = useState(false);

	function setField<K extends keyof SuperAdminSetupForm>(key: K, value: SuperAdminSetupForm[K]) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	function validate(): string | null {
		if (!form.email.includes("@")) return "Введите корректный email";
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
			await createSuperAdmin({
				email: form.email.trim(),
				password: form.password,
				firstName: form.firstName.trim(),
				lastName: form.lastName.trim(),
			});
			setDone(true);
			notify("Администратор создан, можно входить в систему", "ok");
		} catch (error) {
			const message =
				error instanceof ApiRequestError ? error.message : "Не удалось создать администратора";
			notify(message, "warn");
		} finally {
			setSubmitting(false);
		}
	}

	return { form, setField, submit, submitting, done };
}
