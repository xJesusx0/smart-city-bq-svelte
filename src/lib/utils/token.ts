import { TOKEN_KEY } from "$lib/const";

export function getToken() {
	return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}
export function setToken(token: string) {
	if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
}
export function removeToken() {
	if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
}
