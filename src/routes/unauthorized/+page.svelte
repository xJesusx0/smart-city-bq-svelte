<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { ShieldX, ArrowRight, Clock } from "@lucide/svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let countdown = $state(10);

	onMount(() => {
		const firstAllowedRoute = data.allowedRoutes[0]?.path;

		if (firstAllowedRoute) {
			const interval = setInterval(() => {
				countdown--;
				if (countdown === 0) {
					clearInterval(interval);
					goto(firstAllowedRoute);
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	});
</script>

<svelte:head>
	<title>Acceso Denegado - Smart City</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-background p-4">
	<div class="w-full max-w-md space-y-6">
		<!-- Icono y título -->
		<div class="text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10"
			>
				<ShieldX class="h-8 w-8 text-destructive" />
			</div>
			<h1 class="text-2xl font-bold text-foreground">Acceso Denegado</h1>
			<p class="mt-2 text-muted-foreground">No tienes permisos para acceder a esta página</p>
		</div>

		<!-- Información del usuario -->
		{#if data.user}
			<div class="rounded-lg border bg-card p-4">
				<p class="text-sm font-medium text-foreground">{data.user.name}</p>
				<p class="text-xs text-muted-foreground">{data.user.email}</p>
			</div>
		{/if}

		<!-- Rutas disponibles -->
		{#if data.allowedRoutes.length > 0}
			<div class="space-y-4">
				<h2 class="text-lg font-semibold text-foreground">Páginas disponibles:</h2>

				<div class="space-y-2">
					{#each data.allowedRoutes as route (route.path)}
						<a
							href={route.path}
							class="group flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
						>
							<span class="text-sm font-medium text-foreground">{route.name}</span>
							<ArrowRight
								class="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground"
							/>
						</a>
					{/each}
				</div>

				<!-- Countdown -->
				<div class="flex items-center justify-center gap-2 text-sm text-muted-foreground">
					<Clock class="h-4 w-4" />
					<span>
						Redirigiendo a <strong class="text-foreground">{data.allowedRoutes[0].name}</strong> en {countdown}s...
					</span>
				</div>
			</div>
		{:else}
			<div class="space-y-2 text-center">
				<p class="font-medium text-destructive">No tienes acceso a ninguna página del sistema</p>
				<p class="text-sm text-muted-foreground">
					Contacta con el administrador para solicitar permisos
				</p>
			</div>
		{/if}
	</div>
</div>
