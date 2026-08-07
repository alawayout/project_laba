import { TriangleAlert } from "lucide-react";

interface InviteUnavailableNoticeProps {
	title: string;
	message: string;
}

/** Общий вид для "приглашение не найдено/истекло" и "бэкенд недоступен". */
export function InviteUnavailableNotice({ title, message }: Readonly<InviteUnavailableNoticeProps>) {
	return (
		<div className="flex flex-col items-center gap-4 py-4 text-center">
			<span className="flex size-14 items-center justify-center rounded-pill bg-dead text-dead-fg">
				<TriangleAlert className="size-6" />
			</span>
			<p className="text-lg font-medium">{title}</p>
			<p className="text-caption text-fg-secondary">{message}</p>
		</div>
	);
}
