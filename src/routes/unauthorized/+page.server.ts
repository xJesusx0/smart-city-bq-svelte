import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.user,
		allowedRoutes: locals.user?.modules.map((m) => ({ name: m.name, path: m.path })) || []
	};
};
