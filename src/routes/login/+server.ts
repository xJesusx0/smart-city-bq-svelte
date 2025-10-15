import { ISPROD, TOKEN_KEY } from "$lib/api/const";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST({ request, cookies }: RequestEvent) {
	const { token } = await request.json();

	cookies.set(TOKEN_KEY, token, {
		httpOnly: false, // Permitir acceso desde JavaScript
		sameSite: "strict",
		secure: ISPROD,
		path: "/",
		maxAge: 60 * 60 * 24 * 7 // 1 semana
	});

	return json({ success: true });
}
