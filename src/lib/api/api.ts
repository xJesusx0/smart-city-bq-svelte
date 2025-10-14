import createClient from "openapi-fetch";
import type { paths } from "$lib/__gen__/api_v1";
import { BASE_URL, TOKEN_KEY } from "./const";
import { clearAuthTokens } from "./helpers";
import { browser } from "$app/environment";

/**
 * Cliente API tipado con openapi-fetch
 */
export const apiV1 = createClient<paths>({
	baseUrl: BASE_URL,
	fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
		const headers = new Headers(init?.headers);

		if (browser) {
			const token = localStorage.getItem(TOKEN_KEY);
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
		}

		const response = await fetch(input, {
			...init,
			headers,
			credentials: "include"
		});

		if (browser && response.status === 401) {
			clearAuthTokens();

			const currentPath = window.location.pathname;
			const publicRoutes = ["/", "/login", "/register", "/404"];
			const isPublicRoute = publicRoutes.some((route) => currentPath === route);

			if (!isPublicRoute) {
				window.location.href = "/login";
			}
		}

		return response;
	}
});

/**
 * Cliente API para uso en el servidor (hooks.server.ts)
 */
export function createServerApiClient(token?: string) {
	return createClient<paths>({
		baseUrl: BASE_URL,
		headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		credentials: "include"
	});
}
