import { TOKEN_KEY } from "$lib/api/const";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST({ cookies }: RequestEvent) {
	cookies.set(TOKEN_KEY, "", {
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 0
	});
	return json({ success: true });
}
