import { DoctorDetailView } from "@/components/doctors/DoctorDetailView";

interface DoctorPageProps {
	params: Promise<{ id: string }>;
}

export default async function DoctorPage({
	params,
}: Readonly<DoctorPageProps>) {
	const { id } = await params;
	return <DoctorDetailView doctorId={id} />;
}
