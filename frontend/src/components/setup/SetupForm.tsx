"use client";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { AuthSuccessNotice } from "@/components/auth/AuthSuccessNotice";
import { useSuperAdminSetup } from "@/hooks/useSuperAdminSetup";

/** Форма создания первого платформенного администратора (один раз на инстанс). */
export function SetupForm() {
	const { form, setField, submit, submitting, done } = useSuperAdminSetup();

	if (done) {
		return (
			<AuthSuccessNotice title="Администратор создан">
				Теперь можно входить в систему и создавать лаборатории через API/Swagger
				(<code className="text-fg">/docs</code>) или личный кабинет платформы.
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
				label="Email"
				type="email"
				value={form.email}
				onChange={(v) => setField("email", v)}
				placeholder="admin@laba.local"
				autoComplete="email"
			/>
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
			<Button type="submit" block className="mt-2" disabled={submitting}>
				{submitting ? "Создаём…" : "Создать администратора"}
			</Button>
		</form>
	);
}
