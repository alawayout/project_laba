import { TechsDetailView } from "@/components/techs/TechsDetailView";

interface TechPageProps {
	params: Promise<{ id: string }>;
}

export default async function TechPage({ params }: Readonly<TechPageProps>) {
	const { id } = await params;
	return <TechsDetailView techId={id} />;
}
