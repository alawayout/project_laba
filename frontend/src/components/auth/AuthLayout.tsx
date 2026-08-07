import type { ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";

interface AuthLayoutProps {
	title: string;
	subtitle?: string;
	children: ReactNode;
}

/** Центрированная карточка на чёрном канвасе — общий каркас для public-страниц авторизации. */
export function AuthLayout({ title, subtitle, children }: Readonly<AuthLayoutProps>) {
	return (
		<div className="flex min-h-dvh items-center justify-center px-4 py-10">
			<div className="w-full max-w-md">
				<div className="mb-8 flex justify-center">
					<Logo />
				</div>
				<section className="rounded-panel bg-surface-1 p-6 md:p-8">
					<h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
					{subtitle ? (
						<p className="mt-1.5 text-caption text-fg-secondary">{subtitle}</p>
					) : null}
					<div className="mt-6">{children}</div>
				</section>
			</div>
		</div>
	);
}
