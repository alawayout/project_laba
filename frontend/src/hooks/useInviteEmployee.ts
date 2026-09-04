"use client";

import { useState } from "react";
import { createInvite } from "@/lib/api/invites";
import { ApiRequestError } from "@/lib/api/client";
import { useToaster } from "@/hooks/useToaster";

/** Стейт и сабмит формы приглашения нового сотрудника. */
export function useInviteEmployee(labId: string | undefined, onDone: () => void) {
	const { notify } = useToaster();
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<"ADMIN" | "TECHNICIAN">("TECHNICIAN");
	const [submitting, setSubmitting] = useState(false);

	async function submit() {
		if (!labId) return;
		if (!email.trim().includes("@")) {
			notify("Введите корректный email", "warn");
			return;
		}

		setSubmitting(true);
		try {
			const result = await createInvite(labId, { email: email.trim(), role });
			notify(`Приглашение отправлено: ${result.email}`, "ok");
			setEmail("");
			onDone();
		} catch (error) {
			notify(
				error instanceof ApiRequestError ? error.message : "Не удалось создать приглашение",
				"warn",
			);
		} finally {
			setSubmitting(false);
		}
	}

	return { email, setEmail, role, setRole, submit, submitting };
}
