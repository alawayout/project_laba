"use client";

import { useToaster } from "@/hooks";
import { DatePill } from "./DatePill";
import { Logo } from "./Logo";
import { NotificationBell } from "./NotificationBell";
import { ProfileChip } from "./ProfileChip";
import { currentUser } from "@/lib/mocks/user.mock";
import { useEffect, useState } from "react";
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

	const [dateLabel, setDateLabel] = useState("");

	useEffect(() => {
		setDateLabel(DATE_FMT.format(new Date()));
	}, []);

	const onBell = () => notify("Новых уведомлений: 3");

	return (
		<header className="flex flex-col gap-3 px-4 pb-3 pt-4 md:flex-row md:items-center md:gap-5 md:px-8 md:pb-4 md:pt-7">
			<div className="flex items-center justify-between md:justify-start md:gap-5">
				<Logo />
				<div className="flex items-center gap-3 md:hidden">
					<NotificationBell hasUnread onClick={onBell} />
					<ProfileChip user={currentUser} />
				</div>
			</div>

			<GlobalSearch />

			<div className="hidden items-center gap-5 md:flex">
				<DatePill label={dateLabel} />
				<NotificationBell hasUnread onClick={onBell} />
				<ProfileChip user={currentUser} />
			</div>
		</header>
	);
}
