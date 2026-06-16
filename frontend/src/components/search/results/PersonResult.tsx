import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Highlight } from "@/components/ui/Highlight";

interface PersonResultProps {
	href: string;
	avatar: string | null;
	name: string;
	subtitle: string;
	query: string;
	onNavigate: () => void;
}

/** Строка-результат человека (техник / врач): аватар + имя + подпись. */
export function PersonResult({
	href,
	avatar,
	name,
	subtitle,
	query,
	onNavigate,
}: Readonly<PersonResultProps>) {
	return (
		<Link
			href={href}
			onClick={onNavigate}
			className="flex items-center gap-3.5 rounded-2xl px-2.5 py-2.5 transition hover:bg-white/[0.06]"
		>
			<Avatar src={avatar} alt={name} size={48} />
			<div className="min-w-0">
				<div className="truncate text-lg font-medium">
					<Highlight text={name} query={query} />
				</div>
				<div className="truncate text-caption text-fg-muted">
					{subtitle}
				</div>
			</div>
		</Link>
	);
}
