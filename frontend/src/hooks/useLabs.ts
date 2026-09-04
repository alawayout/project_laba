"use client";

import { useCallback, useEffect, useState } from "react";
import {
	listLabs,
	blockLab,
	restoreLab,
	updateLab,
	type LabSummary,
	type UpdateLabInput,
} from "@/lib/api/labs";
import { ApiRequestError } from "@/lib/api/client";
import { useToaster } from "@/hooks/useToaster";

/** Список всех лабораторий платформы + мутации — для экрана платформенного админа. */
export function useLabs() {
	const { notify } = useToaster();
	const [labs, setLabs] = useState<LabSummary[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const reload = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			setLabs(await listLabs());
		} catch (err) {
			setError(
				err instanceof ApiRequestError ? err.message : "Не удалось загрузить лаборатории",
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void reload();
	}, [reload]);

	async function rename(labId: string, input: UpdateLabInput): Promise<boolean> {
		try {
			await updateLab(labId, input);
			notify("Лаборатория обновлена", "ok");
			await reload();
			return true;
		} catch (err) {
			notify(
				err instanceof ApiRequestError ? err.message : "Не удалось обновить лабораторию",
				"warn",
			);
			return false;
		}
	}

	async function block(labId: string): Promise<boolean> {
		try {
			await blockLab(labId);
			notify("Лаборатория заблокирована", "ok");
			await reload();
			return true;
		} catch (err) {
			notify(
				err instanceof ApiRequestError ? err.message : "Не удалось заблокировать лабораторию",
				"warn",
			);
			return false;
		}
	}

	async function restore(labId: string): Promise<boolean> {
		try {
			await restoreLab(labId);
			notify("Лаборатория восстановлена", "ok");
			await reload();
			return true;
		} catch (err) {
			notify(
				err instanceof ApiRequestError ? err.message : "Не удалось восстановить лабораторию",
				"warn",
			);
			return false;
		}
	}

	// CANCELED — единственный статус, который у нас означает «лаба заблокирована»
	// (см. LabsService.blockLab на бэке); остальные статусы — рабочая лаба.
	const active = labs.filter((l) => l.subscription?.status !== "CANCELED");
	const blocked = labs.filter((l) => l.subscription?.status === "CANCELED");

	return { loading, error, labs, active, blocked, reload, rename, block, restore };
}
