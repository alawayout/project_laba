import type { LabRole } from "@/lib/api/invites";
import type { EmployeeStatus } from "@/lib/api/employees";
import { cn } from "@/lib/utils";

const PILL = "inline-flex items-center whitespace-nowrap rounded-pill px-3.5 py-2 text-caption font-semibold";

const ROLE_META: Record<LabRole, { label: string; className: string }> = {
	OWNER: { label: "Владелец", className: "bg-lab text-lab-fg" },
	ADMIN: { label: "Администратор", className: "bg-clinic text-clinic-fg" },
	TECHNICIAN: { label: "Техник", className: "bg-wait text-wait-fg" },
};

export function RoleBadge({ role, className }: Readonly<{ role: LabRole; className?: string }>) {
	const meta = ROLE_META[role];
	return <span className={cn(PILL, meta.className, className)}>{meta.label}</span>;
}

const STATUS_META: Record<EmployeeStatus, { label: string; className: string }> = {
	ACTIVE: { label: "Активен", className: "bg-done text-done-fg" },
	BLOCKED: { label: "Заблокирован", className: "bg-dead text-dead-fg" },
};

export function StatusBadge({
	status,
	className,
}: Readonly<{ status: EmployeeStatus; className?: string }>) {
	const meta = STATUS_META[status];
	return <span className={cn(PILL, meta.className, className)}>{meta.label}</span>;
}

export function RemovedBadge({ className }: Readonly<{ className?: string }>) {
	return <span className={cn(PILL, "bg-wait text-wait-fg", className)}>Уволен</span>;
}
