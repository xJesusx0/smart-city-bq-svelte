<script lang="ts">
	import { onMount } from "svelte";
	import type { CredentialResponse } from "../../routes/oauth/types";
	import { GOOGLE_CLIENT_ID } from "$lib/api/const";
	import { loginWithGoogle } from "$lib/query/auth";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";

	let loading: boolean = false;
	let error: string | null = null;

	const login = loginWithGoogle();

	onMount(() => {
		// Cargar el script de Google Sign-In
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);

		script.onload = () => {
			initializeGoogleSignIn();
		};
	});

	function initializeGoogleSignIn(): void {
		if (!window.google) {
			console.error("Google Sign-In script not loaded");
			return;
		}

		window.google.accounts.id.initialize({
			client_id: GOOGLE_CLIENT_ID,
			callback: handleCredentialResponse
		});

		const buttonElement = document.getElementById("googleSignInButton");
		if (buttonElement) {
			window.google.accounts.id.renderButton(buttonElement, {
				theme: "outline",
				size: "large",
				text: "signin_with",
				shape: "rectangular",
				logo_alignment: "left"
			});
		}
	}

	async function handleCredentialResponse(response: CredentialResponse): Promise<void> {
		loading = true;
		error = null;

		try {
			const token = response.credential;
			$login.mutate(
				{ token },
				{
					onSuccess: () => goto(resolve("/dashboard")),
					onError: (error) => console.log(error)
				}
			);
		} catch (err) {
			error = err instanceof Error ? err.message : "Error desconocido";
			console.error("Error en login:", err);
		} finally {
			loading = false;
		}
	}
</script>

<div id="googleSignInButton"></div>

<style>
	#googleSignInButton {
		display: inline-block;
		margin-top: 20px;
	}
</style>
