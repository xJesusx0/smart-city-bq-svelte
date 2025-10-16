<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { GOOGLE_CLIENT_ID } from "$lib/api/const";
	import GoogleIcon from "$lib/components/icons/GoogleIcon.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Field, FieldGroup, FieldLabel, FieldSeparator } from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { loginUser, loginWithGoogle } from "$lib/query/auth";
	import type { CredentialResponse } from "$lib/types/oauth";
	import { cn } from "$lib/utils.js";
	import { onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
	const id = crypto.randomUUID();

	let username = $state("");
	let password = $state("");
	let googleButtonContainer: HTMLDivElement;

	const login = loginUser();
	const googleLogin = loginWithGoogle();

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

		return () => {
			// Cleanup si es necesario
			script.remove();
		};
	});

	function initializeGoogleSignIn(): void {
		if (!window.google) {
			console.error("Google Sign-In script not loaded");
			return;
		}

		// Inicializar Google Identity Services
		window.google.accounts.id.initialize({
			client_id: GOOGLE_CLIENT_ID,
			callback: handleCredentialResponse,
			auto_select: false,
			cancel_on_tap_outside: true
		});

		if (googleButtonContainer) {
			window.google.accounts.id.renderButton(googleButtonContainer, {
				theme: "outline",
				size: "large",
				text: "continue_with",
				shape: "rectangular"
			});
		}
	}

	async function handleCredentialResponse(response: CredentialResponse): Promise<void> {
		try {
			const token = response.credential;

			$googleLogin.mutate(
				{ token },
				{
					onSuccess: () => {
						console.log("Login successful, redirecting...");
						goto(resolve("/home"));
					},
					onError: (error) => {
						console.error("Login error:", error);
					}
				}
			);
		} catch (err) {
			console.error("Error en login:", err);
		}
	}

	function onSubmit(event: Event) {
		event.preventDefault();

		$login.mutate(
			{
				username,
				password,
				scope: "login",
				client_id: null,
				client_secret: null,
				grant_type: "password"
			},
			{
				onSuccess: () => goto(resolve("/home")),
				onError: (error) => console.log(error)
			}
		);
	}

	function handleGoogleLogin() {
		const googleBtn = googleButtonContainer?.querySelector('div[role="button"]') as HTMLElement;

		if (googleBtn) {
			googleBtn.click();
		} else {
			console.error("Google rendered button not found");
		}
	}
</script>

<div class={cn("flex flex-col gap-6", className)} {...restProps}>
	<Card.Root class="max-w-md overflow-hidden p-0">
		<Card.Content class="grid p-0">
			<form class="p-6 md:p-8" onsubmit={onSubmit}>
				<FieldGroup>
					<div class="flex flex-col items-center gap-2 text-center">
						<h1 class="text-2xl font-bold">Bienvenido</h1>
						<p class="text-balance text-muted-foreground">Entra a tu cuenta de Smart City</p>
					</div>
					<Field>
						<FieldLabel for="email-{id}">Email</FieldLabel>
						<Input
							id="email-{id}"
							type="text"
							required
							bind:value={username}
							disabled={$login.isPending}
						/>
					</Field>
					<Field>
						<div class="flex items-center">
							<FieldLabel for="password-{id}">Contraseña</FieldLabel>
						</div>
						<Input
							id="password-{id}"
							type="password"
							required
							bind:value={password}
							disabled={$login.isPending}
						/>
					</Field>
					{#if $login.status === "error"}
						<div class="text-sm text-destructive">
							{!!$login.error && "Login failed"}
						</div>
					{/if}
					<Field>
						<Button type="submit" disabled={$login.isPending}>
							{$login.isPending ? "Logging in..." : "Login"}
						</Button>
					</Field>
					<FieldSeparator class="*:data-[slot=field-separator-content]:bg-card">
						O Continua Con
					</FieldSeparator>
					<Field class="grid grid-cols-1">
						<Button
							variant="outline"
							type="button"
							onclick={handleGoogleLogin}
							disabled={$googleLogin.isPending}
							class="cursor-pointer truncate"
						>
							<GoogleIcon class="h-4 w-4" />
							{$googleLogin.isPending ? "Iniciando sesión..." : "Continuar con Google"}
						</Button>
					</Field>

					<div bind:this={googleButtonContainer} class="hidden"></div>
				</FieldGroup>
			</form>
		</Card.Content>
	</Card.Root>
</div>
