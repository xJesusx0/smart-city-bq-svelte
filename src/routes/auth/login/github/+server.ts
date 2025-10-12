import { redirect } from "@sveltejs/kit";

export const GET = async ({ locals: { supabase }, url }) => {
	const { data } = await supabase.auth.signInWithOAuth({
		provider: "github",
		options: {
			redirectTo: url.origin + "/auth/callback?next=dashboard"
		}
	});

	if (data.url) {
		redirect(303, data.url);
	}

	redirect(303, "/auth/login?error=Error al iniciar sesión con GitHub");
};
