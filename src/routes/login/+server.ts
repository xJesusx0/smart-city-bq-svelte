import { TOKEN_KEY } from "$lib/api/const";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST({ request, cookies }: RequestEvent) {
	const { token } = await request.json();

	const isProd = process.env.NODE_ENV === "production";
	cookies.set(TOKEN_KEY, token, {
		httpOnly: false, // Permitir acceso desde JavaScript
		sameSite: "strict",
		secure: isProd,
		path: "/",
		maxAge: 60 * 60 * 24 * 7 // 1 semana
	});

	return json({ success: true });
}
