"use client";

import { History, RotateCcw, UserX } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { IconButton } from "@/components/ui/IconButton";
import { canManageEmployee } from "@/lib/permissions";
import type { Employee } from "@/lib/api/employees";
import type { LabRole } from "@/lib/api/invites";
import { RemovedBadge, RoleBadge, StatusBadge } from "./EmployeeBadges";

interface EmployeeRowProps {
	employee: Employee;
	actorRole: LabRole | undefined;
	currentUserId: string | undefined;
	onChangeRole: (role: "ADMIN" | "TECHNICIAN") => void;
	onToggleBlocked: (blocked: boolean) => void;
	onRemove: () => void;
	onRestore: () => void;
	onShowHistory: () => void;
}

const ROLE_OPTIONS = [
	{ id: "ADMIN", label: "Администратор" },
	{ id: "TECHNICIAN", label: "Техник" },
] as const;

/** Строка сотрудника: карточка с ролью/статусом и доступными по правам действиями. */
export function EmployeeRow({
	employee,
	actorRole,
	currentUserId,
	onChangeRole,
	onToggleBlocked,
	onRemove,
	onRestore,
	onShowHistory,
}: Readonly<EmployeeRowProps>) {
	const isSelf = employee.userId === currentUserId;
	const isRemoved = !!employee.deletedAt;
	// Нельзя управлять собой (защита от самоудаления/самоблокировки) и тем,
	// кого запрещает ролевая иерархия (см. lab-permissions.ts на бэке).
	const manageable = !isSelf && canManageEmployee(actorRole, employee.role);

	const fullName = `${employee.firstName} ${employee.lastName}`.trim() || employee.email;

	return (
		<div className="flex flex-col gap-4 rounded-card bg-surface-3 p-5 md:flex-row md:items-center md:justify-between">
			<div className="flex min-w-0 items-center gap-4">
				<Avatar src={null} alt={fullName} size={56} />
				<div className="min-w-0">
					<div className="truncate text-lg font-semibold">
						{fullName}
						{isSelf && <span className="ml-2 text-caption text-fg-muted">(вы)</span>}
					</div>
					<div className="truncate text-caption text-fg-muted">{employee.email}</div>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				{isRemoved ? (
					<>
						<RoleBadge role={employee.role} />
						<RemovedBadge />
						{employee.deletedBy && (
							<span className="text-caption text-fg-muted">
								Уволил: {employee.deletedBy.firstName} {employee.deletedBy.lastName}
							</span>
						)}
					</>
				) : (
					<>
						{manageable && !isRemoved ? (
							<div className="w-[190px]">
								<Select
									label="Роль"
									value={employee.role}
									options={ROLE_OPTIONS}
									onChange={(id) => {
										if (id !== employee.role) onChangeRole(id as "ADMIN" | "TECHNICIAN");
									}}
								/>
							</div>
						) : (
							<RoleBadge role={employee.role} />
						)}
						<StatusBadge status={employee.status} />
						{manageable && (
							<Toggle
								checked={employee.status === "ACTIVE"}
								onChange={(next) => onToggleBlocked(!next)}
								label={employee.status === "ACTIVE" ? "Активен — нажмите, чтобы заблокировать" : "Заблокирован — нажмите, чтобы разблокировать"}
							/>
						)}
					</>
				)}

				<IconButton label="История изменений" onClick={onShowHistory}>
					<History />
				</IconButton>

				{!isRemoved && manageable && (
					<IconButton label="Уволить" tone="warn" onClick={onRemove}>
						<UserX />
					</IconButton>
				)}
				{isRemoved && manageable && (
					<IconButton label="Восстановить" tone="lime" onClick={onRestore}>
						<RotateCcw />
					</IconButton>
				)}
			</div>
		</div>
	);
}
