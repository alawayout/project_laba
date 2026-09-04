"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginRequest, type LabChoice } from "@/lib/api/auth";
import { ApiRequestError } from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";
import { useToaster } from "@/hooks/useToaster";
import { decodeAccessToken } from "@/lib/auth/tokenStorage";
import { getDefaultRoute } from "@/components/layout/nav-items";

export interface LoginFormState {
	email: string;
	password: string;
}

const EMPTY_FORM: LoginFormState = { email: "", password: "" };

/** Стейт и сабмит формы логина, включая шаг выбора лабы при нескольких. */
export function useLogin() {
	const { signIn } = useAuth();
	const { notify } = useToaster();
	const router = useRouter();

	const [form, setForm] = useState<LoginFormState>(EMPTY_FORM);
	const [submitting, setSubmitting] = useState(false);
	const [labChoices, setLabChoices] = useState<LabChoice[] | null>(null);

	function setField<K extends keyof LoginFormState>(key: K, value: LoginFormState[K]) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	async function submit(labId?: string) {
		if (!form.email.trim() || !form.password) {
			notify("Укажите email и пароль", "warn");
			return;
		}

		setSubmitting(true);
		try {
			const result = await loginRequest({
				email: form.email.trim(),
				password: form.password,
				labId,
			});

			if ("requiresLabSelection" in result) {
				setLabChoices(result.labs);
				return;
			}

			await signIn(result);
			notify("Добро пожаловать", "ok");
			// Ведём не всегда на "/" — для платформенного админа там нерелевантный
			// лабе макет главной страницы; getDefaultRoute даёт первый пункт
			// навигации, реально доступный этой сессии (см. nav-items.ts).
			router.push(getDefaultRoute(decodeAccessToken(result.accessToken)));
		} catch (error) {
			const message = error instanceof ApiRequestError ? error.message : "Не удалось войти";
			notify(message, "warn");
		} finally {
			setSubmitting(false);
		}
	}

	return { form, setField, submit, submitting, labChoices };
}
