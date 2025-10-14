import createClient from "openapi-fetch";
import type { paths } from "$lib/__gen__/api_v1";
import { BASE_URL, TOKEN_KEY } from "./const";
import { browser } from "$app/environment";

/**
 * Cliente API tipado con openapi-fetch
 */
export const apiV1 = createClient<paths>({
	baseUrl: BASE_URL,
	fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
		const headers = new Headers(init?.headers);

		// Agregar token automáticamente desde localStorage
		if (browser) {
			const token = localStorage.getItem(TOKEN_KEY);
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
		}

		return await fetch(input, {
			...init,
			headers,
			credentials: "include"
		});
	}
});

/**
 * Cliente API para uso en el servidor (hooks.server.ts)
 * Solo agrega el token al header, no valida
 */
export function createServerApiClient(token?: string) {
	return createClient<paths>({
		baseUrl: BASE_URL,
		headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		credentials: "include"
	});
}
