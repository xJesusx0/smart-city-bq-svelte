import { getOrCreateUserProfile } from "$lib/auth";

export const load = async ({ locals }) => {
	const userProfile = await getOrCreateUserProfile(locals);

	return {
		userProfile
	};
};
