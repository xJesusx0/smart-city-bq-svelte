import type { components } from "$lib/__gen__/api_v1";
import { apiV1, apiV1Auth } from "$lib/api/api";
import { TOKEN_KEY } from "$lib/api/const";
import { deleteCookie, setCookie } from "$lib/api/helpers";
import { createMutation, createQuery } from "@tanstack/svelte-query";

type LoginBodyType = components["schemas"]["Body_login_api_auth_login_post"];
type GoogleTokenRequest = components["schemas"]["GoogleTokenRequest"];

export function loginUser() {
	return createMutation({
		mutationKey: ["login"],
		mutationFn: async (body: LoginBodyType) => {
			const { data, error, response } = await apiV1Auth.POST("/api/auth/login", {
				body: body
			});

			if (error || !response.ok) {
				throw new Error("Login failed");
			}

			const token = data?.access_token;
			if (token) {
				setCookie(TOKEN_KEY, token);
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
	deleteCookie(TOKEN_KEY);
	await fetch("/logout", { method: "POST" });
	window.location.href = "/login";
}

export function loginWithGoogle() {
	return createMutation({
		mutationKey: ["login-google"],
		mutationFn: async (body: GoogleTokenRequest) => {
			const { data, error } = await apiV1.POST("/api/auth/login/google", { body: body });

			if (error) {
				throw new Error("Google login failed");
			}

			const token = data?.access_token;
			if (token) {
				setCookie(TOKEN_KEY, token);

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
