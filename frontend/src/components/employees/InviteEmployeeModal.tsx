"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Select } from "@/components/ui/Select";
import { useInviteEmployee } from "@/hooks/useInviteEmployee";

const ROLE_OPTIONS = [
	{ id: "ADMIN", label: "Администратор" },
	{ id: "TECHNICIAN", label: "Техник" },
] as const;

interface InviteEmployeeModalProps {
	labId: string;
	onClose: () => void;
	onInvited: () => void;
}

/** Форма приглашения нового сотрудника (email + роль). */
export function InviteEmployeeModal({
	labId,
	onClose,
	onInvited,
}: Readonly<InviteEmployeeModalProps>) {
	const { email, setEmail, role, setRole, submit, submitting } = useInviteEmployee(labId, () => {
		onInvited();
		onClose();
	});

	return (
		<Modal title="Пригласить сотрудника" onClose={onClose}>
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
					value={email}
					onChange={setEmail}
					placeholder="employee@lab.local"
					autoComplete="email"
				/>
				<Select
					label="Роль"
					value={role}
					options={ROLE_OPTIONS}
					onChange={(id) => setRole(id as "ADMIN" | "TECHNICIAN")}
				/>
				<Button type="submit" block className="mt-2" disabled={submitting}>
					{submitting ? "Отправляем…" : "Отправить приглашение"}
				</Button>
			</form>
		</Modal>
	);
}
