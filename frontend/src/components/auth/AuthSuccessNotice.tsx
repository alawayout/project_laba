import { Check } from "lucide-react";
import type { ReactNode } from "react";

interface AuthSuccessNoticeProps {
	title: string;
	children?: ReactNode;
}

/** Иконка-галочка + текст — общий вид "готово" для setup/accept-invite. */
export function AuthSuccessNotice({ title, children }: Readonly<AuthSuccessNoticeProps>) {
	return (
		<div className="flex flex-col items-center gap-4 py-4 text-center">
			<span className="flex size-14 items-center justify-center rounded-pill bg-accent-soft text-accent">
				<Check className="size-7" strokeWidth={2.4} />
			</span>
			<p className="text-lg font-medium">{title}</p>
			{children ? <div className="text-caption text-fg-secondary">{children}</div> : null}
		</div>
	);
}
