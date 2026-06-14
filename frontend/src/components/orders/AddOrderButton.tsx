import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface AddOrderButtonProps {
	onClick?: () => void;
	className?: string;
}

/** Кнопка «Добавить наряд» с белым «+» в круге. */
export function AddOrderButton({
	onClick,
	className,
}: Readonly<AddOrderButtonProps>) {
	return (
		<Button
			variant="white"
			onClick={onClick}
			className={cn(
				"inline-flex items-center gap-3.5 py-2 pl-2 pr-7",
				className,
			)}
		>
			<span className="flex size-11 items-center justify-center rounded-pill bg-fg-disabled text-black [&_svg]:size-5">
				<Plus />
			</span>
			Добавить наряд
		</Button>
	);
}
