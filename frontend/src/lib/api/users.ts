import { authFetch } from "./authFetch";
import type { LabRole } from "./invites";

export interface MyLabSummary {
	labId: string;
	labName: string;
	role: LabRole;
	subscriptionStatus: string | null;
}

export interface MyProfile {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	isSuperAdmin: boolean;
	labs: MyLabSummary[];
}

/** Профиль текущего пользователя + лабы, где у него активное членство. */
export function getMyProfile() {
	return authFetch<MyProfile>("/users/me");
}
