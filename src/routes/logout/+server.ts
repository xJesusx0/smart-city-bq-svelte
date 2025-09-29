import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST({ cookies }: RequestEvent) {
	cookies.set("auth_token", "", {
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 0
	});
	return json({ success: true });
}
