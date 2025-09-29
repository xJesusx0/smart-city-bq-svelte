import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST({ request, cookies }: RequestEvent) {
	const { token } = await request.json();

	const isProd = process.env.NODE_ENV === "production";
	cookies.set("auth_token", token, {
		httpOnly: true,
		sameSite: "strict",
		secure: isProd,
		path: "/",
		maxAge: 60 * 60 * 24 * 7 // 1 semana
	});

	return json({ success: true });
}
