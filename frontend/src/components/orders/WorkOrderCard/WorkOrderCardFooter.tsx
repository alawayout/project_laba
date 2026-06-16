import { ArrowUpRight } from "lucide-react";
import { Button } from "../../ui";
import { useRouter } from "next/navigation";

interface WorkOrderCardFooterProps {
	orderId: string;
}

export default function WorkOrderCardFooter({
	orderId,
}: Readonly<WorkOrderCardFooterProps>) {
	const router = useRouter();

	return (
		<div className="mt-auto pt-6 flex items-center justify-center gap-3">
			<Button
				className="
						h-12
						px-8

						rounded-full

						bg-accent
						text-black

						text-base
						font-semibold

						hover:bg-accent-300
					"
			>
				Закрыть наряд
			</Button>

			<button
				onClick={() => router.push(`/orders/${orderId}`)}
				className="
						flex
						h-12
						w-12
						items-center
						justify-center

						rounded-full

						border
						border-white/10

						bg-white/5

						backdrop-blur-xl

						transition-all
						duration-200

						hover:bg-white/10
					"
			>
				<ArrowUpRight size={22} className="text-white" />
			</button>
		</div>
	);
}
