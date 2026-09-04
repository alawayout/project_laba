"use client";

import { Copy, X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { ROLE_LABELS, type InviteListItem, type InviteStatus } from "@/lib/api/invites";
import { useToaster } from "@/hooks/useToaster";
import { cn } from "@/lib/utils";

const PILL = "inline-flex items-center whitespace-nowrap rounded-pill px-3.5 py-2 text-caption font-semibold";

const STATUS_META: Record<InviteStatus, { label: string; className: string }> = {
	PENDING: { label: "Ожидает", className: "bg-work text-work-fg" },
	ACCEPTED: { label: "Принято", className: "bg-done text-done-fg" },
	EXPIRED: { label: "Истекло", className: "bg-wait text-wait-fg" },
	REVOKED: { label: "Отозвано", className: "bg-dead text-dead-fg" },
};

const DATE_FMT = new Intl.DateTimeFormat("ru-RU", {
	day: "numeric",
	month: "long",
	year: "numeric",
});

interface InviteRowProps {
	invite: InviteListItem;
	/** Может ли текущий пользователь отозвать это приглашение (та же иерархия ролей, что и для сотрудников). */
	canManage: boolean;
	onRevoke: () => void;
}

/** Строка приглашения: email, роль, статус, ссылка для копирования, отзыв. */
export function InviteRow({ invite, canManage, onRevoke }: Readonly<InviteRowProps>) {
	const { notify } = useToaster();
	const statusMeta = STATUS_META[invite.status];
	const isPending = invite.status === "PENDING";

	async function copyLink() {
		if (!invite.acceptUrl) return;
		try {
			await navigator.clipboard.writeText(invite.acceptUrl);
			notify("Ссылка скопирована", "ok");
		} catch {
			notify("Не удалось скопировать ссылку", "warn");
		}
	}

	return (
		<div className="flex flex-col gap-4 rounded-card bg-surface-3 p-5 md:flex-row md:items-center md:justify-between">
			<div className="min-w-0">
				<div className="truncate text-lg font-semibold">{invite.email}</div>
				<div className="mt-1 truncate text-caption text-fg-muted">
					{ROLE_LABELS[invite.role]} · до {DATE_FMT.format(new Date(invite.expiresAt))}
					{invite.invitedBy &&
						` · пригласил(а) ${invite.invitedBy.firstName} ${invite.invitedBy.lastName}`}
				</div>
				{isPending && invite.acceptUrl && (
					<div className="mt-2 truncate text-caption text-fg-muted">{invite.acceptUrl}</div>
				)}
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<span className={cn(PILL, statusMeta.className)}>{statusMeta.label}</span>

				{isPending && invite.acceptUrl && (
					<IconButton label="Скопировать ссылку-приглашение" onClick={() => void copyLink()}>
						<Copy />
					</IconButton>
				)}
				{isPending && canManage && (
					<IconButton label="Отозвать приглашение" tone="warn" onClick={onRevoke}>
						<X />
					</IconButton>
				)}
			</div>
		</div>
	);
}
