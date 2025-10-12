import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
	return {
		error: url.searchParams.get("error")
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		if (!email || !password) {
			return fail(400, {
				error: "Email y contraseña son requeridos"
			});
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			return fail(400, {
				error: "Credenciales inválidas. Verifica tu email y contraseña."
			});
		}

		if (!data.user) {
			return fail(400, {
				error: "Error al iniciar sesión"
			});
		}

		redirect(303, "/dashboard");
	}
};

