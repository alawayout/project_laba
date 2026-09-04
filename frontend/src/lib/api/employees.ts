import { authFetch } from "./authFetch";
import type { LabRole } from "./invites";

export type EmployeeStatus = "ACTIVE" | "BLOCKED";

export interface EmployeeActor {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export interface Employee {
	userId: string;
	labId: string;
	role: LabRole;
	status: EmployeeStatus;
	email: string;
	firstName: string;
	lastName: string;
	isAccountActive: boolean;
	createdAt: string;
	updatedAt: string;
	/** Отметка мягкого удаления (увольнения) — null, если сотрудник активен. */
	deletedAt: string | null;
	deletedBy: EmployeeActor | null;
}

export type MembershipEventType =
	| "CREATED"
	| "ROLE_CHANGED"
	| "BLOCKED"
	| "UNBLOCKED"
	| "REMOVED"
	| "RESTORED";

export interface MembershipEvent {
	id: string;
	type: MembershipEventType;
	metadata: Record<string, unknown> | null;
	createdAt: string;
	actor: EmployeeActor | null;
}

export interface UpdateEmployeeInput {
	role?: Extract<LabRole, "ADMIN" | "TECHNICIAN">;
	status?: EmployeeStatus;
}

/** Сотрудники лабы. includeRemoved=true добавляет уволенных (архив). */
export function listEmployees(labId: string, includeRemoved = false) {
	const query = includeRemoved ? "?includeRemoved=true" : "";
	return authFetch<Employee[]>(`/labs/${labId}/employees${query}`);
}

export function getEmployee(labId: string, userId: string) {
	return authFetch<Employee>(`/labs/${labId}/employees/${userId}`);
}

export function getEmployeeHistory(labId: string, userId: string) {
	return authFetch<MembershipEvent[]>(`/labs/${labId}/employees/${userId}/history`);
}

export function updateEmployee(labId: string, userId: string, input: UpdateEmployeeInput) {
	return authFetch<Employee>(`/labs/${labId}/employees/${userId}`, {
		method: "PATCH",
		body: JSON.stringify(input),
	});
}

export function removeEmployee(labId: string, userId: string, reason?: string) {
	return authFetch<Employee>(`/labs/${labId}/employees/${userId}`, {
		method: "DELETE",
		body: JSON.stringify({ reason }),
	});
}

export function restoreEmployee(labId: string, userId: string) {
	return authFetch<Employee>(`/labs/${labId}/employees/${userId}/restore`, {
		method: "POST",
	});
}
