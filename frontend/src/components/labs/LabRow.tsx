"use client";

import { Pencil, RotateCcw, ShieldOff, Users } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import type { LabSummary } from "@/lib/api/labs";
import { NoSubscriptionBadge, SubscriptionBadge } from "./LabBadges";

interface LabRowProps {
	lab: LabSummary;
	onEdit: () => void;
	onBlock: () => void;
	onRestore: () => void;
}

const DATE_FMT = new Intl.DateTimeFormat("ru-RU", {
	day: "numeric",
	month: "long",
	year: "numeric",
});

/** Строка лаборатории: владелец, подписка, число участников, действия админа. */
export function LabRow({ lab, onEdit, onBlock, onRestore }: Readonly<LabRowProps>) {
	const isBlocked = lab.subscription?.status === "CANCELED";
	const ownerName = lab.owner
		? `${lab.owner.firstName} ${lab.owner.lastName}`.trim() || lab.owner.email
		: null;

	return (
		<div className="flex flex-col gap-4 rounded-card bg-surface-3 p-5 md:flex-row md:items-center md:justify-between">
			<div className="flex min-w-0 items-center gap-4">
				<Avatar src={null} alt={lab.name} size={56} />
				<div className="min-w-0">
					<div className="truncate text-lg font-semibold">{lab.name}</div>
					<div className="truncate text-caption text-fg-muted">
						{ownerName ? `Владелец: ${ownerName}` : "Владелец ещё не принял приглашение"}
					</div>
					<div className="truncate text-caption text-fg-muted">
						Зарегистрирована {DATE_FMT.format(new Date(lab.createdAt))}
						{lab.subscription && (
							<> · подписка до {DATE_FMT.format(new Date(lab.subscription.expiresAt))}</>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<span className="inline-flex items-center gap-1.5 text-caption text-fg-muted">
					<Users className="h-4 w-4" />
					{lab.membersCount}
				</span>
				{lab.subscription ? (
					<SubscriptionBadge status={lab.subscription.status} />
				) : (
					<NoSubscriptionBadge />
				)}

				<IconButton label="Изменить лабораторию" onClick={onEdit}>
					<Pencil />
				</IconButton>
				{isBlocked ? (
					<IconButton label="Восстановить лабораторию" tone="lime" onClick={onRestore}>
						<RotateCcw />
					</IconButton>
				) : (
					<IconButton label="Заблокировать лабораторию" tone="warn" onClick={onBlock}>
						<ShieldOff />
					</IconButton>
				)}
			</div>
		</div>
	);
}
