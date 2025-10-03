import { redirect, type Handle } from "@sveltejs/kit";
import { apiV1 } from "$lib/api/api";

export const handle: Handle = async ({ event, resolve }) => {
	let user = null;
	const protectedRoutes = ["/dashboard"];
	const isProtected = protectedRoutes.some((route) => event.url.pathname.startsWith(route));

	if (isProtected) {
		const token = event.cookies.get("auth_token");
		if (token) {
			try {
				const { data } = await apiV1.GET("/api/auth/me", {
					headers: { Authorization: `Bearer ${token}` }
				});
				user = data;
			} catch {
				user = null;
			}
		}
		if (!user) {
			return redirect(303, "/login");
		}
	}
	event.locals.user = user;
	return await resolve(event);
};
