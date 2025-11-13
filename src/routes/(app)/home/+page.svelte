<script lang="ts">
	import type { PageData } from "./$types";
	import type { components } from "$lib/__gen__/api_v1";
	import MapClick from "$lib/components/maps/MapClick.svelte";
	import { Button } from "$lib/components/ui/button/index.js";

	let { data }: { data: PageData } = $props();

	// Obtener módulos con tipo correcto
	const allowedModules = $derived(
		(data.user?.modules || []) as components["schemas"]["ModuleBase"][]
	);

	let confirmedCoords: { lat: number; lng: number } | null = $state(null);

	function handleConfirm(event: CustomEvent<{ lat: number; lng: number }>) {
		confirmedCoords = event.detail;
		console.log("Coordenadas confirmadas:", confirmedCoords);
		// Aquí puedes hacer la llamada a tu API, navegar a otra página, etc.
		// Por ejemplo:
		// await saveLocation(confirmedCoords);
		// goto('/next-step');
	}

	function clearConfirmedCoords() {
		confirmedCoords = null;
	}
</script>

<svelte:head>
	<title>Dashboard - Smart City</title>
</svelte:head>

<div class="p-8">
	<div class="mb-6">
		<h2 class="mb-2 text-3xl font-bold">
			Bienvenido{#if data.user}, {data.user.name}{/if}!
		</h2>
		<p class="text-muted-foreground">Este es el panel de control de Smart City</p>
	</div>

	<!-- Cards de módulos disponibles -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each allowedModules as module (module.id)}
			<a
				href={module.path}
				class="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
			>
				<h3 class="mb-2 text-lg font-semibold group-hover:text-primary">
					{module.name}
				</h3>
				{#if module.description}
					<p class="text-sm text-muted-foreground">
						{module.description}
					</p>
				{/if}
				<div class="mt-4 flex items-center text-sm text-primary">
					<span>Acceder</span>
					<span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
				</div>
			</a>
		{/each}
	</div>

	{#if allowedModules.length === 0}
		<div class="rounded-lg border-2 border-dashed p-8 text-center">
			<p class="text-lg">No tienes módulos asignados</p>
			<p class="mt-2 text-muted-foreground">
				Contacta con el administrador para solicitar acceso a los módulos del sistema
			</p>
		</div>
	{/if}

	<div class="mt-8">
		<h3 class="mb-2 text-2xl font-bold">Mapa de la ciudad</h3>
		<p class="text-muted-foreground">Haz clic en el mapa para seleccionar una ubicación</p>
		<MapClick on:confirm={handleConfirm} />

		{#if confirmedCoords}
			<div class="mt-4 rounded-lg border border-green-500 bg-green-50 p-4 dark:bg-green-950">
				<div class="flex items-center justify-between">
					<div>
						<p class="font-medium text-green-900 dark:text-green-100">
							Ubicación confirmada
						</p>
						<p class="mt-1 text-sm text-green-700 dark:text-green-300">
							Lat: {confirmedCoords.lat.toFixed(5)}, Lng: {confirmedCoords.lng.toFixed(5)}
						</p>
					</div>
					<Button variant="outline" size="sm" onclick={clearConfirmedCoords}>
						Limpiar
					</Button>
				</div>
			</div>
		{/if}
	</div>
</div>
