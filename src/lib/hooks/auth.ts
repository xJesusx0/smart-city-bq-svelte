import { createQuery, createMutation } from "@tanstack/svelte-query";
import type { components } from "$lib/__gen__/api_v1";
import { apiV1 } from "$lib/api";
import { removeToken, setToken } from "$lib/utils/token";

type LoginBodyType = components["schemas"]["Body_login_api_auth_login_post"];

export function useLogin() {
	return createMutation({
		mutationKey: ["login"],
		mutationFn: async (body: LoginBodyType) => {
			const { data } = await apiV1.POST("/api/auth/login", { body });
			const token = (data as any)?.access_token;
			if (token) {
				setToken(token);
			}
			return data;
		}
	});
}

export function useAuthMe() {
	return createQuery({
		queryKey: ["auth-me"],
		queryFn: async () => {
			const { data } = await apiV1.GET("/api/auth/me");
			return data;
		}
	});
}

export function logout() {
	removeToken();
}
