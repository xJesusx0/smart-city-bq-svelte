import { isUserAdmin } from "$lib/auth";
import { db } from "$lib/db";
import { profileTable } from "$lib/db/schema";
import { error, fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { zfd } from "zod-form-data";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	// Verificar que el usuario esté autenticado
	const { user } = await locals.safeGetSession();
	if (!user) {
		redirect(303, "/auth/login");
	}

	// Verificar que sea administrador
	const admin = await isUserAdmin(locals);
	if (!admin) {
		error(403, "No tienes permisos de administrador");
	}

	// Obtener lista de usuarios
	const users = await db.query.profileTable.findMany({
		orderBy: (profile, { desc }) => [desc(profile.createdAt)]
	});

	return {
		users
	};
};

export const actions: Actions = {
	addUser: async ({ request, locals }) => {
		// Verificar que sea administrador
		const admin = await isUserAdmin(locals);
		if (!admin) {
			error(403, "No tienes permisos de administrador");
		}

		const schema = zfd.formData({
			firstName: zfd.text(),
			lastName: zfd.text(),
			email: zfd.text(),
			documentType: zfd.text().optional(),
			document: zfd.text().optional(),
			role: zfd.text().optional()
		});

		const result = schema.safeParse(await request.formData());

		if (!result.success) {
			return fail(400, {
				error: "Datos del formulario inválidos",
				message: result.error.message
			});
		}

		const { data } = result;

		try {
			// Verificar si el email ya existe
			const existingUser = await db.query.profileTable.findFirst({
				where: eq(profileTable.email, data.email)
			});

			if (existingUser) {
				return fail(400, {
					error: "El email ya está registrado",
					message: `Ya existe un usuario con el email ${data.email}`
				});
			}

			// Generar contraseña automática: parte antes del @ del email
			const emailPrefix = data.email.split("@")[0];
			const generatedPassword = emailPrefix;

			// Crear usuario en Supabase Auth
			const { data: authData, error: authError } = await locals.supabase.auth.admin.createUser({
				email: data.email,
				password: generatedPassword,
				email_confirm: true // Auto-confirmar el email
			});

			if (authError || !authData.user) {
				console.error("Error creando usuario en Supabase Auth:", authError);
				return fail(500, {
					error: "Error al crear usuario en Supabase Auth",
					message: authError?.message ?? "Error desconocido"
				});
			}

			// Crear perfil en la base de datos
			await db.insert(profileTable).values({
				id: authData.user.id,
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				documentType: data.documentType ?? null,
				document: data.document ?? null,
				role: data.role ?? "user",
				isAuthorized: true
			});

			return {
				success: true,
				message: `Usuario creado exitosamente. Contraseña: ${generatedPassword}`,
				generatedPassword
			};
		} catch (err) {
			console.error("Error al crear usuario:", err);
			return fail(500, {
				error: "Error al crear usuario",
				message: err instanceof Error ? err.message : "Error desconocido"
			});
		}
	},

	deleteUser: async ({ request, locals }) => {
		// Verificar que sea administrador
		const admin = await isUserAdmin(locals);
		if (!admin) {
			error(403, "No tienes permisos de administrador");
		}

		const formData = await request.formData();
		const userId = formData.get("userId") as string;

		if (!userId) {
			return fail(400, {
				error: "ID de usuario requerido"
			});
		}

		try {
			// Eliminar usuario de Supabase Auth
			const { error: authError } = await locals.supabase.auth.admin.deleteUser(userId);

			if (authError) {
				console.error("Error eliminando usuario de Supabase Auth:", authError);
			}

			// Eliminar perfil de la base de datos
			await db.delete(profileTable).where(eq(profileTable.id, userId));

			return {
				success: true,
				message: "Usuario eliminado exitosamente"
			};
		} catch (err) {
			console.error("Error al eliminar usuario:", err);
			return fail(500, {
				error: "Error al eliminar usuario",
				message: err instanceof Error ? err.message : "Error desconocido"
			});
		}
	}
};

