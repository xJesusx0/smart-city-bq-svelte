import { TOKEN_KEY } from "$lib/api/const";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST({ cookies }: RequestEvent) {
	cookies.delete(TOKEN_KEY, { path: "/" });
	return json({ success: true });
}
