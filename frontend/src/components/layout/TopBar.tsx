"use client";

import { useState } from "react";
import { SearchInput } from "@/components/ui";
import { useToaster } from "@/hooks";
import type { CurrentUser } from "@/lib/types";
import { DatePill } from "./DatePill";
import { Logo } from "./Logo";
import { NotificationBell } from "./NotificationBell";
import { ProfileChip } from "./ProfileChip";

export interface SearchControl {
  value: string;
  onChange: (next: string) => void;
}

interface TopBarProps {
  user: CurrentUser;
  /** When omitted, the search field is decorative (detail screens). */
  search?: SearchControl;
}

export function TopBar({ user, search }: TopBarProps) {
  const { notify } = useToaster();
  const [localQuery, setLocalQuery] = useState("");

  const value = search ? search.value : localQuery;
  const onChange = search ? search.onChange : setLocalQuery;
  const onBell = () => notify("Новых уведомлений: 3");

  return (
    <header className="flex flex-col gap-3 px-4 pb-3 pt-4 md:flex-row md:items-center md:gap-5 md:px-8 md:pb-4 md:pt-7">
      <div className="flex items-center justify-between md:justify-start md:gap-5">
        <Logo />
        <div className="flex items-center gap-3 md:hidden">
          <NotificationBell hasUnread onClick={onBell} />
          <ProfileChip user={user} />
        </div>
      </div>

      <SearchInput value={value} onChange={onChange} className="md:flex-1" />

      <div className="hidden items-center gap-5 md:flex">
        <DatePill label="19 Июля" />
        <NotificationBell hasUnread onClick={onBell} />
        <ProfileChip user={user} />
      </div>
    </header>
  );
}
