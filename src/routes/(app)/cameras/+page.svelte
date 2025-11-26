<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import TrafficLightsMap from "$lib/components/cameras/traffic-lights-map.svelte";
	import { getTrafficLightsQuery } from "$lib/query/geo";
	import { AlertTriangle, Loader, MapPin, PlusCircle } from "@lucide/svelte";
	import { goto } from "$app/navigation";

	const trafficLightsQuery = getTrafficLightsQuery();

	function handleCreateTrafficLight() {
		goto("/cameras/create");
	}
</script>

<svelte:head>
	<title>Semáforos - Smart City</title>
</svelte:head>

<div class="space-y-8 p-8">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-2">
				<MapPin class="h-6 w-6" />
				<h1 class="text-3xl font-bold tracking-tight">Mapa de semáforos</h1>
			</div>
			<p class="mt-2 text-muted-foreground">Visualiza los semáforos instalados en la ciudad.</p>
		</div>
		<Button class="gap-2" onclick={handleCreateTrafficLight}>
			<PlusCircle class="h-4 w-4" />
			Crear semáforo
		</Button>
	</header>

	<section class="rounded-lg border bg-card p-6 shadow-sm">
		{#if $trafficLightsQuery?.isLoading}
			<div class="flex items-center justify-center gap-2 text-muted-foreground">
				<Loader class="h-4 w-4 animate-spin" />
				<p>Cargando semáforos...</p>
			</div>
		{:else if $trafficLightsQuery?.isError}
			<div
				class="flex flex-col items-center justify-center gap-4 text-center text-muted-foreground"
			>
				<AlertTriangle class="h-8 w-8 text-destructive" />
				<div>
					<p class="font-medium text-destructive">No pudimos cargar los semáforos</p>
					<p>Intenta recargar la página o vuelve más tarde.</p>
				</div>
				<Button variant="outline" onclick={() => $trafficLightsQuery?.refetch?.()}>
					Intentar nuevamente
				</Button>
			</div>
		{:else}
			<div class="space-y-4">
				<p class="text-sm text-muted-foreground">
					{$trafficLightsQuery?.data?.length || 0} semáforos registrados
				</p>
				<TrafficLightsMap trafficLights={$trafficLightsQuery?.data ?? []} />
			</div>
		{/if}
	</section>
</div>
