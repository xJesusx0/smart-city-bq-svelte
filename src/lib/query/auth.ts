import { createQuery, createMutation } from "@tanstack/svelte-query";
import type { components } from "$lib/__gen__/api_v1";
import { apiV1 } from "$lib/api/api";
import { TOKEN_KEY } from "$lib/api/const";
import { clearAuthTokens } from "$lib/api/helpers";

type LoginBodyType = components["schemas"]["Body_login_api_auth_login_post"];
type GoogleTokenRequest = components["schemas"]["GoogleTokenRequest"];

export function loginUser() {
	return createMutation({
		mutationKey: ["login"],
		mutationFn: async (body: LoginBodyType) => {
			const { data, error } = await apiV1.POST("/api/auth/login", {
				headers: {
					"content-type": "application/x-www-form-urlencoded"
				},
				body: body
			});

			if (error) {
				clearAuthTokens();
				throw new Error("Login failed");
			}

			const token = data?.access_token;
			if (token) {
				localStorage.setItem(TOKEN_KEY, token);

				await fetch("/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token })
				});
			}
			return data;
		}
	});
}

export function authMeUser() {
	return createQuery({
		queryKey: ["auth-me"],
		queryFn: async () => {
			const { data, error } = await apiV1.GET("/api/auth/me");
			if (error) {
				throw new Error("Authentication failed");
			}
			return data;
		},
		retry: (failureCount, error) => {
			if (error?.message === "Authentication failed") {
				return false;
			}
			return failureCount < 3;
		}
	});
}

export async function logout() {
	clearAuthTokens();
	window.location.reload();
}

export function loginWithGoogle() {
	return createMutation({
		mutationKey: ["login-google"],
		mutationFn: async (body: GoogleTokenRequest) => {
			const { data, error } = await apiV1.POST("/api/auth/login/google", { body: body });

			if (error) {
				clearAuthTokens();
				throw new Error("Google login failed");
			}

			const token = data?.access_token;
			if (token) {
				localStorage.setItem(TOKEN_KEY, token);

				await fetch("/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token })
				});
			}
			return data;
		}
	});
}
