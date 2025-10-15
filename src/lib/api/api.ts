import createClient from "openapi-fetch";
import type { paths } from "$lib/__gen__/api_v1";
import { BASE_URL, TOKEN_KEY } from "./const";
import { deleteCookie, getCookie } from "./helpers";
import { browser } from "$app/environment";

/**
 * Cliente API tipado con openapi-fetch
 */
export const apiV1 = createClient<paths>({
	baseUrl: BASE_URL,
	fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
		const headers = new Headers(init?.headers);

		if (browser) {
			const token = getCookie(TOKEN_KEY);
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
			deleteCookie(TOKEN_KEY);
			window.location.href = "/login";
		}

		return response;
	}
});

export const apiV1Auth = createClient<paths>({
	baseUrl: BASE_URL,
	bodySerializer: (body) => {
		if (body && typeof body === "object") {
			const params = new URLSearchParams();
			for (const [key, value] of Object.entries(body)) {
				if (value !== undefined && value !== null) {
					params.append(key, String(value));
				}
			}
			return params.toString();
		}
		return String(body);
	},
	fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
		const headers = new Headers(init?.headers);

		if (browser) {
			const token = getCookie(TOKEN_KEY);
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
		}

		headers.set("Content-Type", "application/x-www-form-urlencoded");

		const response = await fetch(input, {
			...init,
			headers,
			credentials: "include"
		});

		if (browser && response.status === 401) {
			deleteCookie(TOKEN_KEY);
			window.location.href = "/login";
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
