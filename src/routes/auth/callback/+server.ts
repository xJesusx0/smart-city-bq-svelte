import { redirect } from "@sveltejs/kit";
import { db } from "$lib/db";
import { profileTable } from "$lib/db/schema";
import { eq } from "drizzle-orm";

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const code = url.searchParams.get("code") as string;
	const next = url.searchParams.get("next") ?? "dashboard";

	if (code) {
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error && data.user) {
			// Verificar si el usuario está autorizado
			const profile = await db.query.profileTable.findFirst({
				where: eq(profileTable.email, data.user.email ?? "")
			});

			// Si no existe perfil o no está autorizado, cerrar sesión y redirigir al login
			if (!profile || !profile.isAuthorized) {
				await supabase.auth.signOut();
				throw redirect(
					303,
					"/auth/login?error=Tu cuenta no ha sido autorizada. Contacta con un administrador."
				);
			}

			// Si existe perfil autorizado pero el ID no coincide, actualizar el ID
			if (profile.id !== data.user.id) {
				await db
					.update(profileTable)
					.set({
						id: data.user.id,
						updatedAt: new Date()
					})
					.where(eq(profileTable.email, data.user.email ?? ""));
			}

			// Asegurarse de que la ruta comience con /
			const redirectPath = next.startsWith("/") ? next : `/${next}`;
			throw redirect(303, redirectPath);
		}
	}

	// return the user to an error page with instructions
	throw redirect(303, "/auth/login?error=Error en la autenticación");
};
