<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Field, FieldGroup, FieldLabel } from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { changePassword } from "$lib/query/auth";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	const id = crypto.randomUUID();

	let password = $state("");
	let confirmPassword = $state("");
	let validationError = $state<string | null>(null);

	const changePasswordMutation = changePassword();

	onMount(() => {
		if (!data.token) {
			validationError = "Token no válido o faltante";
		}
	});

	function validateForm(): boolean {
		validationError = null;

		if (!password) {
			validationError = "La contraseña es requerida";
			return false;
		}

		if (!confirmPassword) {
			validationError = "Por favor confirma tu contraseña";
			return false;
		}

		if (password !== confirmPassword) {
			validationError = "Las contraseñas no coinciden";
			return false;
		}

		if (password.length < 6) {
			validationError = "La contraseña debe tener al menos 6 caracteres";
			return false;
		}

		return true;
	}

	function onSubmit(event: Event) {
		event.preventDefault();

		if (!data.token) {
			validationError = "Token no válido o faltante";
			return;
		}

		if (!validateForm()) {
			return;
		}

		$changePasswordMutation.mutate(
			{
				token: data.token,
				password
			},
			{
				onSuccess: () => {
					goto(resolve("/home"));
				},
				onError: (error) => {
					console.error("Change password error:", error);
					validationError = "Error al cambiar la contraseña. Por favor intenta nuevamente.";
				}
			}
		);
	}
</script>

<svelte:head>
	<title>Cambiar Contraseña - Smart City</title>
</svelte:head>

<div class="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
	<div class="w-full max-w-md">
		<Card.Root class="max-w-md overflow-hidden p-0">
			<Card.Content class="grid p-0">
				<form class="p-6 md:p-8" onsubmit={onSubmit}>
					<FieldGroup>
						<div class="flex flex-col items-center gap-2 text-center">
							<h1 class="text-2xl font-bold">Crear Contraseña</h1>
							<p class="text-balance text-muted-foreground">Crea tu nueva contraseña</p>
						</div>
						<Field>
							<FieldLabel for="password-{id}">Nueva Contraseña</FieldLabel>
							<Input
								id="password-{id}"
								type="password"
								required
								bind:value={password}
								disabled={$changePasswordMutation.isPending || !data.token}
								placeholder="Ingresa tu nueva contraseña"
							/>
						</Field>
						<Field>
							<FieldLabel for="confirm-password-{id}">Confirmar Contraseña</FieldLabel>
							<Input
								id="confirm-password-{id}"
								type="password"
								required
								bind:value={confirmPassword}
								disabled={$changePasswordMutation.isPending || !data.token}
								placeholder="Confirma tu nueva contraseña"
							/>
						</Field>
						{#if validationError}
							<div class="text-sm text-destructive">{validationError}</div>
						{/if}
						{#if $changePasswordMutation.status === "error" && !validationError}
							<div class="text-sm text-destructive">
								Error al cambiar la contraseña. Por favor intenta nuevamente.
							</div>
						{/if}
						<Field>
							<Button
								type="submit"
								disabled={$changePasswordMutation.isPending || !data.token}
								class="w-full"
							>
								{$changePasswordMutation.isPending
									? "Cambiando contraseña..."
									: "Cambiar Contraseña"}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</Card.Content>
		</Card.Root>
	</div>
</div>
