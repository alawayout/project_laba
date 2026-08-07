import { ApiRequestError } from "@/lib/api/client";
import { getInviteInfo, ROLE_LABELS } from "@/lib/api/invites";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AcceptInviteForm } from "@/components/invites/AcceptInviteForm";
import { InviteUnavailableNotice } from "@/components/invites/InviteUnavailableNotice";

export const dynamic = "force-dynamic";

interface AcceptInvitePageProps {
	params: Promise<{ token: string }>;
}

export default async function AcceptInvitePage({ params }: Readonly<AcceptInvitePageProps>) {
	const { token } = await params;

	try {
		const invite = await getInviteInfo(token);
		const roleLabel = ROLE_LABELS[invite.role];

		return (
			<AuthLayout
				title="Приглашение в лабораторию"
				subtitle={`${invite.labName} · роль «${roleLabel}» · ${invite.email}`}
			>
				<AcceptInviteForm token={token} invite={invite} />
			</AuthLayout>
		);
	} catch (error) {
		const notFound = error instanceof ApiRequestError && error.statusCode === 404;
		return (
			<AuthLayout title="Приглашение в лабораторию">
				<InviteUnavailableNotice
					title={notFound ? "Приглашение недействительно" : "Не удалось связаться с API"}
					message={
						notFound
							? "Ссылка уже использована, отозвана или истёк срок её действия. Попросите пригласившего отправить новую."
							: `${error instanceof Error ? error.message : "Неизвестная ошибка"}. Проверьте, что бэкенд поднят, и обновите страницу.`
					}
				/>
			</AuthLayout>
		);
	}
}
