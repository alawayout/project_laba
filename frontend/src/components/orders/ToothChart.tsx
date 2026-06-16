import { cn } from "@/lib/utils";
import type { ToothArch } from "@/lib/types";
import { ToothShape } from "./ToothShape";

interface ToothChartProps {
	isSelected: (tooth: number) => boolean;
	onToggle: (tooth: number) => void;
	label: string;
	/** Кнопки быстрого выбора челюсти (режим формы). */
	onSelectArch?: (arch: ToothArch) => void;
	/** Ссылка «Очистить» рядом с выбранными (режим формы). */
	onClear?: () => void;
}

const ARCH_LABELS: { arch: ToothArch; label: string }[] = [
	{ arch: "all", label: "Все зубы" },
	{ arch: "upper", label: "Верхняя челюсть" },
	{ arch: "lower", label: "Нижняя челюсть" },
];

const UPPER = Array.from({ length: 16 }, (_, i) => i + 1); // 1..16
const LOWER = Array.from({ length: 16 }, (_, i) => 32 - i); // 32..17

// Uniform x distribution prevents cosine-compression at the arch edges.
// Arch depth follows sin(π·t) so edges are level and center dips down.
const MAX_ROT = 30; // degrees — max lean at molars
const ARCH = Array.from({ length: 16 }, (_, i) => {
	const t = i / 15; // 0 → 1
	return {
		xPct: 7 + 86 * t,                  // evenly spaced 7% … 93%
		sinTheta: Math.sin(Math.PI * t),    // 0 at edges, 1 at center
		rotDeg: -(t - 0.5) * 2 * MAX_ROT,  // +30° left, 0° center, −30° right
	};
});

const ARCH_DEPTH = 80; // px — how much the arch curves from edge to center
const TOOTH_H = 36;    // px — tooth SVG height
const TOOTH_W = 18;    // px — tooth SVG width
const SLOT_H = TOOTH_H + 4 + 12; // 52px — tooth + gap + label
const CONTAINER_H = ARCH_DEPTH + SLOT_H; // 132px

interface ArchProps {
	teeth: number[];
	flip: boolean;
	isSelected: (tooth: number) => boolean;
	onToggle: (tooth: number) => void;
}

// Mobile: flat row that shares width equally and never overflows
function ArchMobile({
	teeth,
	flip,
	isSelected,
	onToggle,
}: Readonly<ArchProps>) {
	return (
		<div className="flex gap-0.5">
			{teeth.map((n) => {
				const selected = isSelected(n);
				return (
					<button
						key={n}
						type="button"
						onClick={() => onToggle(n)}
						aria-pressed={selected}
						aria-label={`Зуб ${n}`}
						className="group flex min-w-0 flex-1 flex-col items-center gap-1"
					>
						<span
							className={cn(
								"block h-6 w-full transition-transform group-hover:scale-110",
								selected
									? "text-accent"
									: "text-[#cfcfcf] group-hover:text-white",
							)}
						>
							<ToothShape flip={flip} />
						</span>
						<span
							className={cn(
								"block text-[10px] font-medium leading-none",
								selected ? "text-accent" : "text-[#cfcfcf]",
							)}
						>
							{n}
						</span>
					</button>
				);
			})}
		</div>
	);
}

// Desktop: arch layout with teeth positioned along a semi-ellipse
function ArchDesktop({
	teeth,
	flip,
	isSelected,
	onToggle,
}: Readonly<ArchProps>) {
	return (
		<div className="relative w-full" style={{ height: CONTAINER_H }}>
			{teeth.map((n, i) => {
				const { xPct, sinTheta, rotDeg } = ARCH[i];
				const selected = isSelected(n);

				// upper (flip=false): molars at y=0, front teeth at y=ARCH_DEPTH
				// lower (flip=true):  front teeth at y=0, molars at y=ARCH_DEPTH
				const top = flip
					? ARCH_DEPTH * (1 - sinTheta)
					: ARCH_DEPTH * sinTheta;

				return (
					<button
						key={n}
						type="button"
						onClick={() => onToggle(n)}
						aria-pressed={selected}
						aria-label={`Зуб ${n}`}
						className="group absolute flex flex-col items-center gap-1"
						style={{
							left: `${xPct}%`,
							top,
							width: TOOTH_W,
							transform: `translateX(-50%) rotate(${rotDeg}deg)`,
						}}
					>
						{flip ? (
							<>
								<span
									className={cn(
										"block text-[11px] font-medium leading-none",
										selected
											? "text-accent"
											: "text-[#cfcfcf]",
									)}
								>
									{n}
								</span>
								<span
									className={cn(
										"block transition-transform group-hover:scale-110",
										selected
											? "text-accent"
											: "text-[#cfcfcf] group-hover:text-white",
									)}
									style={{ width: TOOTH_W, height: TOOTH_H }}
								>
									<ToothShape flip />
								</span>
							</>
						) : (
							<>
								<span
									className={cn(
										"block transition-transform group-hover:scale-110",
										selected
											? "text-accent"
											: "text-[#cfcfcf] group-hover:text-white",
									)}
									style={{ width: TOOTH_W, height: TOOTH_H }}
								>
									<ToothShape />
								</span>
								<span
									className={cn(
										"block text-[11px] font-medium leading-none",
										selected
											? "text-accent"
											: "text-[#cfcfcf]",
									)}
								>
									{n}
								</span>
							</>
						)}
					</button>
				);
			})}
		</div>
	);
}

/** Dental chart: two arches, click a tooth to toggle selection. */
export function ToothChart({
	isSelected,
	onToggle,
	label,
	onSelectArch,
	onClear,
}: Readonly<ToothChartProps>) {
	return (
		<div className="py-2">
			{/* Mobile: flat rows that fit within container without overflow */}
			<div className="flex flex-col gap-5 md:hidden">
				<ArchMobile
					teeth={UPPER}
					flip={false}
					isSelected={isSelected}
					onToggle={onToggle}
				/>
				<ArchMobile
					teeth={LOWER}
					flip
					isSelected={isSelected}
					onToggle={onToggle}
				/>
			</div>

			{/* Desktop: arch layout mirroring jaw anatomy */}
			<div className="hidden md:mx-auto md:flex md:w-full md:max-w-165 md:flex-col md:gap-4">
				<ArchDesktop
					teeth={UPPER}
					flip={false}
					isSelected={isSelected}
					onToggle={onToggle}
				/>
				<ArchDesktop
					teeth={LOWER}
					flip
					isSelected={isSelected}
					onToggle={onToggle}
				/>
			</div>

			{onSelectArch && (
				<div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
					{ARCH_LABELS.map(({ arch, label: archLabel }) => (
						<button
							key={arch}
							type="button"
							onClick={() => onSelectArch(arch)}
							className="text-md font-medium text-fg-tertiary transition hover:text-fg"
						>
							{archLabel}
						</button>
					))}
				</div>
			)}

			<div className="mt-5 flex items-center justify-between gap-3">
				<p className="text-md font-medium text-fg-tertiary">
					Выбрано: <span className="text-fg">{label}</span>
				</p>
				{onClear && (
					<button
						type="button"
						onClick={onClear}
						className="shrink-0 text-md font-medium text-accent transition hover:brightness-110"
					>
						Очистить
					</button>
				)}
			</div>
		</div>
	);
}
