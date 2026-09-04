import OrdersPage from "@/components/orders/OrdersPage";
import { RedirectIfSuperAdmin } from "@/components/auth/RedirectIfSuperAdmin";

export default function HomePage() {
	return (
		<RedirectIfSuperAdmin>
			<OrdersPage />
		</RedirectIfSuperAdmin>
	);
}
