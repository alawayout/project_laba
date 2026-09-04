"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ApiRequestError } from "@/lib/api/client";
import { getEmployeeHistory, type MembershipEvent } from "@/lib/api/employees";

interface EmployeeHistoryModalProps {
	labId: string;
	userId: string;
	employeeName: string;
	onClose: () => void;
}

const EVENT_LABELS: Record<MembershipEvent["type"], string> = {
	CREATED: "Принял приглашение",
	ROLE_CHANGED: "Изменена роль",
	BLOCKED: "Заблокирован",
	UNBLOCKED: "Разблокирован",
	REMOVED: "Уволен",
	RESTORED: "Восстановлен",
};

const DATE_FMT = new Intl.DateTimeFormat("ru-RU", {
	day: "numeric",
	month: "long",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
});

/** История членства сотрудника: кто/когда менял роль, блокировал, увольнял, восстанавливал. */
export function EmployeeHistoryModal({
	labId,
	userId,
	employeeName,
	onClose,
}: Readonly<EmployeeHistoryModalProps>) {
	const [events, setEvents] = useState<MembershipEvent[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		getEmployeeHistory(labId, userId)
			.then((data) => {
				if (!cancelled) setEvents(data);
			})
			.catch((err: unknown) => {
				if (!cancelled) {
					setError(err instanceof ApiRequestError ? err.message : "Не удалось загрузить историю");
				}
			});
		return () => {
			cancelled = true;
		};
	}, [labId, userId]);

	return (
		<Modal title={`История: ${employeeName}`} onClose={onClose} size="lg">
			{error && <p className="text-md text-dead-fg">{error}</p>}
			{!error && !events && <p className="text-md text-fg-muted">Загрузка…</p>}
			{!error && events && events.length === 0 && (
				<p className="text-md text-fg-muted">Событий пока нет.</p>
			)}
			{!error && events && events.length > 0 && (
				<ul className="flex flex-col gap-3">
					{events.map((event) => (
						<li key={event.id} className="rounded-field bg-[#262626] p-4">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<span className="font-semibold">{EVENT_LABELS[event.type]}</span>
								<span className="text-caption text-fg-muted">
									{DATE_FMT.format(new Date(event.createdAt))}
								</span>
							</div>
							<div className="mt-1 text-caption text-fg-secondary">
								{event.actor ? `${event.actor.firstName} ${event.actor.lastName}` : "Система"}
							</div>
							{event.metadata && Object.keys(event.metadata).length > 0 && (
								<div className="mt-1 text-caption text-fg-muted">
									{formatMetadata(event.metadata)}
								</div>
							)}
						</li>
					))}
				</ul>
			)}
		</Modal>
	);
}

function formatMetadata(metadata: Record<string, unknown>): string {
	return Object.entries(metadata)
		.filter(([, value]) => value !== null && value !== undefined && value !== "")
		.map(([key, value]) => `${key}: ${String(value)}`)
		.join(" · ");
}
