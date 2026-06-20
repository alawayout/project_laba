import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { TECHS } from "@/lib/mocks/techs";

/** Заготовка экрана техника (переход из поиска). */
export function TechsDetailView({ techId }: Readonly<{ techId: string }>) {
	const techs = TECHS; // TODO: fetch tech by ID
	const tech = techs.find((t) => t.id === techId);

	if (!tech) {
		return (
			<div className="anim-view max-w-[1480px]">
				<header className="my-3.5 flex items-center gap-5.5">
					<Link
						href="/"
						aria-label="На главную"
						className="flex size-[74px] shrink-0 items-center justify-center rounded-pill bg-surface-3 transition hover:scale-105 hover:bg-surface-4 [&_svg]:size-7"
					>
						<Home />
					</Link>
					<Link
						href="/"
						aria-label="Назад"
						className="flex size-[42px] items-center justify-center [&_svg]:size-7"
					>
						<ChevronLeft />
					</Link>
					<h1 className="text-3xl font-semibold">Техник</h1>
				</header>

				<section className="rounded-panel bg-surface-3 p-5.5">
					<p className="text-md text-fg-muted">Техник не найден.</p>
				</section>
			</div>
		);
	}

	return (
		<div className="anim-view max-w-[1480px]">
			<header className="my-3.5 flex items-center gap-5.5">
				<Link
					href="/"
					aria-label="На главную"
					className="flex size-[74px] shrink-0 items-center justify-center rounded-pill bg-surface-3 transition hover:scale-105 hover:bg-surface-4 [&_svg]:size-7"
				>
					<Home />
				</Link>
				<Link
					href="/"
					aria-label="Назад"
					className="flex size-[42px] items-center justify-center [&_svg]:size-7"
				>
					<ChevronLeft />
				</Link>
				<h1 className="text-3xl font-semibold">Техник</h1>
			</header>

			<section className="rounded-panel bg-surface-3 p-5.5">
				<div className="flex items-center gap-5">
					<Avatar src={tech.avatar} alt={tech.name} size={88} />
					<div>
						<div className="text-2xl font-semibold">
							{tech.name}
						</div>
						<div className="mt-1 text-md text-fg-muted">
							{tech.category}
						</div>
					</div>
				</div>
				<p className="mt-6 max-w-[640px] text-md text-fg-muted">
					Раздел в разработке. Здесь появятся наряды техника и
					история заказов.
				</p>
			</section>
		</div>
	);
}
