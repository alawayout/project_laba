"use client";

import { useCallback, useEffect, useState } from "react";
import {
	listEmployees,
	removeEmployee,
	restoreEmployee,
	updateEmployee,
	type Employee,
} from "@/lib/api/employees";
import { ApiRequestError } from "@/lib/api/client";
import { useToaster } from "@/hooks/useToaster";

/**
 * Загружает всех сотрудников лабы (активных + архив одним запросом,
 * дальше делим на вкладки на клиенте) и даёт мутации с тостами и
 * автоматическим релоадом списка после успеха.
 */
export function useEmployees(labId: string | undefined) {
	const { notify } = useToaster();
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const reload = useCallback(async () => {
		if (!labId) {
			setLoading(false);
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const list = await listEmployees(labId, true);
			setEmployees(list);
		} catch (err) {
			setError(
				err instanceof ApiRequestError ? err.message : "Не удалось загрузить сотрудников",
			);
		} finally {
			setLoading(false);
		}
	}, [labId]);

	useEffect(() => {
		void reload();
	}, [reload]);

	async function changeRole(userId: string, role: "ADMIN" | "TECHNICIAN"): Promise<boolean> {
		if (!labId) return false;
		try {
			await updateEmployee(labId, userId, { role });
			notify("Роль обновлена", "ok");
			await reload();
			return true;
		} catch (err) {
			notify(err instanceof ApiRequestError ? err.message : "Не удалось изменить роль", "warn");
			return false;
		}
	}

	async function toggleBlocked(userId: string, blocked: boolean): Promise<boolean> {
		if (!labId) return false;
		try {
			await updateEmployee(labId, userId, { status: blocked ? "BLOCKED" : "ACTIVE" });
			notify(blocked ? "Сотрудник заблокирован" : "Сотрудник разблокирован", "ok");
			await reload();
			return true;
		} catch (err) {
			notify(err instanceof ApiRequestError ? err.message : "Не удалось изменить статус", "warn");
			return false;
		}
	}

	async function remove(userId: string, reason?: string): Promise<boolean> {
		if (!labId) return false;
		try {
			await removeEmployee(labId, userId, reason);
			notify("Сотрудник уволен", "ok");
			await reload();
			return true;
		} catch (err) {
			notify(
				err instanceof ApiRequestError ? err.message : "Не удалось удалить сотрудника",
				"warn",
			);
			return false;
		}
	}

	async function restore(userId: string): Promise<boolean> {
		if (!labId) return false;
		try {
			await restoreEmployee(labId, userId);
			notify("Сотрудник восстановлен", "ok");
			await reload();
			return true;
		} catch (err) {
			notify(
				err instanceof ApiRequestError ? err.message : "Не удалось восстановить сотрудника",
				"warn",
			);
			return false;
		}
	}

	const active = employees.filter((e) => !e.deletedAt);
	const archived = employees.filter((e) => !!e.deletedAt);

	return {
		loading,
		error,
		active,
		archived,
		reload,
		changeRole,
		toggleBlocked,
		remove,
		restore,
	};
}
