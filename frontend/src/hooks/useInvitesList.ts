"use client";

import { useCallback, useEffect, useState } from "react";
import { listInvites, revokeInvite, type InviteListItem } from "@/lib/api/invites";
import { ApiRequestError } from "@/lib/api/client";
import { useToaster } from "@/hooks/useToaster";

/** Список приглашений лабы (все статусы) + отзыв ещё не принятых. */
export function useInvitesList(labId: string | undefined) {
	const { notify } = useToaster();
	const [invites, setInvites] = useState<InviteListItem[]>([]);
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
			setInvites(await listInvites(labId));
		} catch (err) {
			setError(
				err instanceof ApiRequestError ? err.message : "Не удалось загрузить приглашения",
			);
		} finally {
			setLoading(false);
		}
	}, [labId]);

	useEffect(() => {
		void reload();
	}, [reload]);

	async function revoke(inviteId: string): Promise<boolean> {
		if (!labId) return false;
		try {
			await revokeInvite(labId, inviteId);
			notify("Приглашение отозвано", "ok");
			await reload();
			return true;
		} catch (err) {
			notify(
				err instanceof ApiRequestError ? err.message : "Не удалось отозвать приглашение",
				"warn",
			);
			return false;
		}
	}

	return { invites, loading, error, reload, revoke };
}
