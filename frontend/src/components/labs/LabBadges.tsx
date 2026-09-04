import type { SubscriptionStatus } from "@/lib/api/labs";
import { cn } from "@/lib/utils";

const PILL = "inline-flex items-center whitespace-nowrap rounded-pill px-3.5 py-2 text-caption font-semibold";

const STATUS_META: Record<SubscriptionStatus, { label: string; className: string }> = {
	TRIALING: { label: "Пробный период", className: "bg-work text-work-fg" },
	ACTIVE: { label: "Активна", className: "bg-done text-done-fg" },
	PAST_DUE: { label: "Просрочена оплата", className: "bg-dead text-dead-fg" },
	EXPIRED: { label: "Истекла", className: "bg-wait text-wait-fg" },
	CANCELED: { label: "Заблокирована", className: "bg-dead text-dead-fg" },
};

export function SubscriptionBadge({
	status,
	className,
}: Readonly<{ status: SubscriptionStatus; className?: string }>) {
	const meta = STATUS_META[status];
	return <span className={cn(PILL, meta.className, className)}>{meta.label}</span>;
}

export function NoSubscriptionBadge({ className }: Readonly<{ className?: string }>) {
	return <span className={cn(PILL, "bg-wait text-wait-fg", className)}>Без подписки</span>;
}
