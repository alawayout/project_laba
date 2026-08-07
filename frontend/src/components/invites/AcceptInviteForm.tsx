"use client";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { AuthSuccessNotice } from "@/components/auth/AuthSuccessNotice";
import { useAcceptInvite } from "@/hooks/useAcceptInvite";
import type { InviteInfo } from "@/lib/api/invites";

interface AcceptInviteFormProps {
	token: string;
	invite: InviteInfo;
}

/** Форма принятия приглашения: пароль/имя только для новых аккаунтов. */
export function AcceptInviteForm({ token, invite }: Readonly<AcceptInviteFormProps>) {
	const needsProfile = !invite.userExists;
	const { form, setField, submit, submitting, done } = useAcceptInvite(token, needsProfile);

	if (done) {
		return (
			<AuthSuccessNotice title="Вы присоединились к лаборатории">
				{invite.labName} — теперь можно войти в систему под своим email.
			</AuthSuccessNotice>
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
			{needsProfile ? (
				<>
					<div className="grid grid-cols-2 gap-3.5">
						<TextField
							label="Имя"
							value={form.firstName}
							onChange={(v) => setField("firstName", v)}
							placeholder="Иван"
							autoComplete="given-name"
						/>
						<TextField
							label="Фамилия"
							value={form.lastName}
							onChange={(v) => setField("lastName", v)}
							placeholder="Иванов"
							autoComplete="family-name"
						/>
					</div>
					<TextField
						label="Пароль"
						type="password"
						value={form.password}
						onChange={(v) => setField("password", v)}
						placeholder="Минимум 8 символов"
						autoComplete="new-password"
					/>
					<TextField
						label="Повторите пароль"
						type="password"
						value={form.confirmPassword}
						onChange={(v) => setField("confirmPassword", v)}
						placeholder="Ещё раз"
						autoComplete="new-password"
					/>
				</>
			) : (
				<p className="text-caption text-fg-secondary">
					У вас уже есть аккаунт с email <span className="text-fg">{invite.email}</span> —
					просто подтвердите присоединение к лаборатории.
				</p>
			)}
			<Button type="submit" block className="mt-2" disabled={submitting}>
				{submitting ? "Принимаем…" : "Принять приглашение"}
			</Button>
		</form>
	);
}
