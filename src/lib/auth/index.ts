import { db } from "$lib/db";
import { profileTable } from "$lib/db/schema";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

/**
 * Obtiene el perfil de un usuario autenticado.
 * IMPORTANTE: Ya NO crea automáticamente perfiles.
 * Solo los usuarios previamente autorizados por un admin pueden acceder.
 */
export const getOrCreateUserProfile = async (locals: App.Locals) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		return null;
	}

	// Buscar perfil existente
	const curProfile = await db.query.profileTable.findFirst({
		where: eq(profileTable.id, user.id)
	});

	// Si existe el perfil, verificar que esté autorizado
	if (curProfile) {
		if (!curProfile.isAuthorized) {
			error(403, "Tu cuenta no ha sido autorizada. Contacta con un administrador.");
		}
		return curProfile;
	}

	// Si no existe perfil, buscar por email para enlazar cuenta OAuth
	const profileByEmail = await db.query.profileTable.findFirst({
		where: eq(profileTable.email, user.email ?? "")
	});

	if (profileByEmail && profileByEmail.isAuthorized) {
		// Actualizar el ID del perfil para enlazar con la cuenta de Supabase
		await db
			.update(profileTable)
			.set({
				id: user.id,
				updatedAt: new Date()
			})
			.where(eq(profileTable.email, user.email ?? ""));

		const updatedProfile = await db.query.profileTable.findFirst({
			where: eq(profileTable.id, user.id)
		});

		return updatedProfile;
	}

	// Si no existe perfil autorizado, rechazar acceso
	error(
		403,
		"No tienes acceso a esta aplicación. Tu cuenta debe ser creada por un administrador primero."
	);
};

/**
 * Verifica si un usuario es administrador
 */
export const isUserAdmin = async (locals: App.Locals): Promise<boolean> => {
	const profile = await getOrCreateUserProfile(locals);
	return profile?.role === "admin";
};
