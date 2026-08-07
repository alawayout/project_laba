import { TriangleAlert } from "lucide-react";

interface SetupUnavailableNoticeProps {
	message: string;
}

/** Бэкенд недоступен при загрузке /setup — просим проверить, что API поднят. */
export function SetupUnavailableNotice({ message }: Readonly<SetupUnavailableNoticeProps>) {
	return (
		<div className="flex flex-col items-center gap-4 py-4 text-center">
			<span className="flex size-14 items-center justify-center rounded-pill bg-dead text-dead-fg">
				<TriangleAlert className="size-6" />
			</span>
			<p className="text-lg font-medium">Не удалось связаться с API</p>
			<p className="text-caption text-fg-secondary">
				{message}. Проверьте, что бэкенд поднят (<code className="text-fg">docker compose up</code>),
				и обновите страницу.
			</p>
		</div>
	);
}
