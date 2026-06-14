import { type ReactNode } from "react";
import { NavRail } from "./NavRail";
import { TopBar } from "./TopBar";
import { SearchProvider } from "@/hooks/useSearchQuery";

interface AppShellProps {
	children: ReactNode;
}

/** App frame: nav rail + top bar + scrollable content area. */
export function AppShell({ children }: AppShellProps) {
	return (
		<SearchProvider>
			<div className="flex h-dvh flex-col overflow-hidden md:flex-row">
				<NavRail />
				<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
					<TopBar />
					<main className="flex-1 overflow-y-auto px-4 pb-28 md:px-8 md:pb-16">
						{children}
					</main>
				</div>
			</div>
		</SearchProvider>
	);
}
