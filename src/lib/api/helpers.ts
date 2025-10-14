import { TOKEN_KEY } from "./const";

export function clearAuthTokens(): void {
	if (typeof window !== "undefined") {
		// Limpiar localStorage
		localStorage.removeItem(TOKEN_KEY);

		// Limpiar cookie llamando al endpoint de logout
		fetch("/logout", { method: "POST" }).catch(console.error);
	}
}
