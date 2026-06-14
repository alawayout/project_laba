import type { ReactNode } from "react";
import { currentUser } from "@/lib/mocks/user.mock";
import { NavRail } from "./NavRail";
import { TopBar, type SearchControl } from "./TopBar";

interface AppShellProps {
  children: ReactNode;
  search?: SearchControl;
}

/** App frame: nav rail + top bar + scrollable content area. */
export function AppShell({ children, search }: AppShellProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden md:flex-row">
      <NavRail />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar user={currentUser} search={search} />
        <main className="flex-1 overflow-y-auto px-4 pb-28 md:px-8 md:pb-16">{children}</main>
      </div>
    </div>
  );
}
