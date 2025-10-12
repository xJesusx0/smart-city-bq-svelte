import { getOrCreateUserProfile } from "$lib/auth";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const profile = await getOrCreateUserProfile(locals);

	return {
		profile
	};
};

