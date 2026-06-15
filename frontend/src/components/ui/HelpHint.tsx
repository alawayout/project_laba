import { cn } from "@/lib/utils";

/** Подсказка-аффорданс «?» в лаймовом круге. */
export function HelpHint({ className }: Readonly<{ className?: string }>) {
	return (
		<span
			className={cn(
				"inline-flex size-5.5 items-center justify-center rounded-pill border-[1.5px] border-accent text-micro text-accent",
				className,
			)}
			aria-hidden="true"
		>
			?
		</span>
	);
}
