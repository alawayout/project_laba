"use client";

import { useAnalytics } from "@/hooks";
import { DistributionCard } from "./DistributionCard";
import { KpiGrid } from "./KpiGrid";
import { OrdersTrendCard } from "./OrdersTrendCard";

/** Интерактивная часть аналитики: KPI, тренд и распределения + переключатель периода. */
export function AnalyticsContent() {
	const {
		range,
		setRange,
		kpis,
		series,
		statusDistribution,
		workTypeDistribution,
	} = useAnalytics();

	return (
		<>
			<KpiGrid kpis={kpis} />

			<div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
				<OrdersTrendCard
					series={series}
					range={range}
					onRangeChange={setRange}
				/>
				<DistributionCard title="По статусам" slices={statusDistribution} />
			</div>

			<div className="mt-5">
				<DistributionCard
					title="По видам работ"
					slices={workTypeDistribution}
				/>
			</div>
		</>
	);
}
