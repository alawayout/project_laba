import { OrderDetailView } from "@/components/orders";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  return <OrderDetailView orderId={id} />;
}
