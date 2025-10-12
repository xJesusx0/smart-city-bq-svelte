import { getOrCreateUserProfile } from "$lib/auth";
import { db } from "$lib/db/index.js";
import { profileTable } from "$lib/db/schema.js";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { zfd } from "zod-form-data";

export const load = async ({ locals }) => {
	const userProfile = await getOrCreateUserProfile(locals);

	return {
		userProfile
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		const userProfile = await getOrCreateUserProfile(locals);

		if (!userProfile) {
			error(401, "No estas logeado");
		}

		const schema = zfd.formData({
			firstName: zfd.text(),
			lastName: zfd.text(),
			documentType: zfd.text(),
			document: zfd.text()
		});

		const { data } = schema.safeParse(await request.formData());

		if (!data) {
			error(400, "Invalid form data");
		}

		await db
			.update(profileTable)
			.set({
				firstName: data.firstName,
				lastName: data.lastName,
				documentType: data.documentType,
				document: data.document
			})
			.where(eq(profileTable.id, userProfile.id));

		return {
			success: true
		};
	}
};
