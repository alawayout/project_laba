"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { ROLE_LABELS } from "@/lib/api/invites";
import { useAuth } from "@/hooks/useAuth";
import { useLogin } from "@/hooks/useLogin";
import { getDefaultRoute } from "@/components/layout/nav-items";

/** Форма входа: email/пароль, с шагом выбора лабы при нескольких активных. */
export function LoginForm() {
	const { form, setField, submit, submitting, labChoices } = useLogin();
	const { isAuthenticated, loading: authLoading, session } = useAuth();
	const router = useRouter();

	// Уже авторизован (например, вернулись на /login по старой ссылке или
	// кнопке «назад») — сразу в приложение, форму логина не показываем.
	// getDefaultRoute — тот же выбор первого доступного маршрута, что и после
	// логина (для платформенного админа это /labs, а не общий "/").
	useEffect(() => {
		if (!authLoading && isAuthenticated) {
			router.replace(getDefaultRoute(session));
		}
	}, [authLoading, isAuthenticated, session, router]);

	if (authLoading || isAuthenticated) {
		return <p className="text-caption text-fg-muted">Проверяем сессию…</p>;
	}

	if (labChoices) {
		return (
			<div className="flex flex-col gap-3">
				<p className="text-caption text-fg-secondary">
					У вас несколько лабораторий — выберите, в какую войти.
				</p>
				{labChoices.map((lab) => (
					<button
						key={lab.labId}
						type="button"
						disabled={submitting}
						onClick={() => void submit(lab.labId)}
						className="flex items-center justify-between rounded-field bg-[#262626] px-5 py-3.5 text-left transition hover:bg-surface-6 disabled:opacity-50"
					>
						<span className="text-lg font-medium">{lab.labName}</span>
						<span className="text-caption text-fg-muted">{ROLE_LABELS[lab.role]}</span>
					</button>
				))}
			</div>
		);
	}

	return (
		<form
			className="flex flex-col gap-3.5"
			onSubmit={(e) => {
				e.preventDefault();
				void submit();
			}}
		>
			<TextField
				label="Email"
				type="email"
				value={form.email}
				onChange={(v) => setField("email", v)}
				placeholder="you@lab.local"
				autoComplete="email"
			/>
			<TextField
				label="Пароль"
				type="password"
				value={form.password}
				onChange={(v) => setField("password", v)}
				placeholder="Пароль"
				autoComplete="current-password"
			/>
			<Button type="submit" block className="mt-2" disabled={submitting}>
				{submitting ? "Входим…" : "Войти"}
			</Button>
		</form>
	);
}
