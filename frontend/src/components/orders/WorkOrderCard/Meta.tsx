interface MetaProps {
	label: string;
	value: string;
}
export default function Meta({ label, value }: Readonly<MetaProps>) {
	return (
		<div className="min-w-0">
			<div className="mb-1 text-sm text-white/55">{label}</div>

			<div className="text-[17px] leading-tight font-medium text-white">
				{value}
			</div>
		</div>
	);
}
