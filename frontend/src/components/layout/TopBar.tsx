"use client";

import { useEffect, useState } from "react";
import { useToaster } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_LABELS } from "@/lib/api/invites";
import { DatePill } from "./DatePill";
import { Logo } from "./Logo";
import { NotificationBell } from "./NotificationBell";
import { ProfileChip } from "./ProfileChip";
import { GlobalSearch } from "../search/GlobalSearch";

export interface SearchControl {
	value: string;
	onChange: (next: string) => void;
}

const DATE_FMT = new Intl.DateTimeFormat("ru-RU", {
	day: "numeric",
	month: "long",
});

export function TopBar() {
	const { notify } = useToaster();
	const { session, profile } = useAuth();

	const [dateLabel, setDateLabel] = useState("");

	useEffect(() => {
		setDateLabel(DATE_FMT.format(new Date()));
	}, []);

	const onBell = () => notify("Новых уведомлений: 3");

	// `profile` — полный профиль с /users/me; `session` — данные из access-токена
	// (доступны мгновенно, ещё до ответа профиля). Пока профиль не подтянулся,
	// используем то, что уже decode-нулось из токена, не показывая моковые данные.
	const name = profile
		? `${profile.firstName} ${profile.lastName}`.trim() || profile.email
		: "…";
	const roleLabel = session?.isSuperAdmin
		? "Платформенный администратор"
		: session?.role
			? ROLE_LABELS[session.role]
			: "";

	return (
		<header className="flex flex-col gap-3 px-4 pb-3 pt-4 md:flex-row md:items-center md:gap-5 md:px-8 md:pb-4 md:pt-7">
			<div className="flex items-center justify-between md:justify-start md:gap-5">
				<Logo />
				<div className="flex items-center gap-3 md:hidden">
					<NotificationBell hasUnread onClick={onBell} />
					<ProfileChip name={name} roleLabel={roleLabel} />
				</div>
			</div>

			<GlobalSearch />

			<div className="hidden items-center gap-5 md:flex">
				<DatePill label={dateLabel} />
				<NotificationBell hasUnread onClick={onBell} />
				<ProfileChip name={name} roleLabel={roleLabel} />
			</div>
		</header>
	);
}
