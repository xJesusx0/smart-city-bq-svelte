export const TOKEN_KEY = "jwt_token";
export const BASE_URL = import.meta.env.VITE_API_URL || "/api-py";
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

/**
 * Limpia todos los tokens de autenticación (localStorage y cookies)
 * Solo funciona en el cliente (browser)
 */
export function clearAuthTokens(): void {
	if (typeof window !== "undefined") {
		// Limpiar localStorage
		localStorage.removeItem(TOKEN_KEY);

		// Limpiar cookie llamando al endpoint de logout
		fetch("/logout", { method: "POST" }).catch(console.error);
	}
}
