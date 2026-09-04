import type { LabRole } from "@/lib/api/invites";

/**
 * Зеркало backend'ного MANAGE_PERMISSIONS (src/common/constants/lab-permissions.ts) —
 * только для мгновенных UI-подсказок (какие кнопки показывать/скрывать).
 * Источник истины и реальная проверка прав — всегда на сервере.
 */
const MANAGE_PERMISSIONS: Record<LabRole, LabRole[]> = {
	OWNER: ["ADMIN", "TECHNICIAN"],
	ADMIN: ["TECHNICIAN"],
	TECHNICIAN: [],
};

export function canManageEmployee(actorRole: LabRole | undefined, targetRole: LabRole): boolean {
	return !!actorRole && MANAGE_PERMISSIONS[actorRole].includes(targetRole);
}
