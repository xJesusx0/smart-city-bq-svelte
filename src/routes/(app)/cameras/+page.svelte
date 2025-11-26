<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import TrafficLightsMap from "$lib/components/cameras/traffic-lights-map.svelte";
	import TrafficLightsList from "$lib/components/cameras/traffic-lights-list.svelte";
	import TrafficLightsStats from "$lib/components/cameras/traffic-lights-stats.svelte";
	import TrafficLightDetailsDialog from "$lib/components/cameras/traffic-light-details-dialog.svelte";
	import { getTrafficLightsQuery } from "$lib/query/geo";
	import { AlertTriangle, Loader, MapPin, PlusCircle, Map, List } from "@lucide/svelte";
	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";
	import type { components } from "$lib/__gen__/api_v1";

	type TrafficLight = components["schemas"]["TrafficLight"];

	const trafficLightsQuery = getTrafficLightsQuery();

	let searchQuery = $state("");
	let statusFilter = $state<string>("all");
	let selectedTrafficLight = $state<TrafficLight | null>(null);
	let detailsDialogOpen = $state(false);
	let viewMode = $state<string>("map");

	// Load view preference from localStorage
	if (browser) {
		const savedView = localStorage.getItem("cameras-view-mode");
		if (savedView === "map" || savedView === "list") {
			viewMode = savedView;
		}
	}

	$effect(() => {
		if (browser && viewMode) {
			localStorage.setItem("cameras-view-mode", viewMode);
		}
	});

	function handleCreateTrafficLight() {
		goto("/cameras/create");
	}

	function handleViewDetails(trafficLight: TrafficLight) {
		selectedTrafficLight = trafficLight;
		detailsDialogOpen = true;
	}

	const filteredTrafficLights = $derived(() => {
		const data = $trafficLightsQuery?.data ?? [];
		let filtered = data;

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			filtered = filtered.filter(
				(tl) =>
					tl.name?.toLowerCase().includes(query) ||
					tl.id?.toString().includes(query) ||
					tl.key?.toLowerCase().includes(query)
			);
		}

		// Filter by status
		if (statusFilter === "active") {
			filtered = filtered.filter((tl) => tl.active === true);
		} else if (statusFilter === "inactive") {
			filtered = filtered.filter((tl) => tl.active === false);
		} else if (statusFilter !== "all") {
			// If statusFilter is not a valid value, default to "all"
			statusFilter = "all";
		}

		return filtered;
	});
</script>

<svelte:head>
	<title>Semáforos - Smart City</title>
</svelte:head>

<div class="space-y-6 p-4 sm:p-6 lg:p-8">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-2">
				<MapPin class="h-6 w-6" />
				<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Semáforos</h1>
			</div>
			<p class="mt-2 text-sm text-muted-foreground sm:text-base">
				Visualiza y gestiona los semáforos instalados en la ciudad.
			</p>
		</div>
		<Button class="gap-2" onclick={handleCreateTrafficLight}>
			<PlusCircle class="h-4 w-4" />
			<span class="hidden sm:inline">Crear semáforo</span>
			<span class="sm:hidden">Crear</span>
		</Button>
	</header>

	{#if $trafficLightsQuery?.isLoading}
		<section class="rounded-lg border bg-card p-6 shadow-sm">
			<div class="flex items-center justify-center gap-2 text-muted-foreground">
				<Loader class="h-4 w-4 animate-spin" />
				<p>Cargando semáforos...</p>
			</div>
		</section>
	{:else if $trafficLightsQuery?.isError}
		<section class="rounded-lg border bg-card p-6 shadow-sm">
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
		</section>
	{:else}
		{#if $trafficLightsQuery?.data && $trafficLightsQuery.data.length > 0}
			<TrafficLightsStats trafficLights={$trafficLightsQuery.data} />
		{/if}

		<section class="space-y-4">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
				<Tabs.Root bind:value={viewMode}>
					<Tabs.List>
						<Tabs.Trigger value="map">
							<Map class="mr-2 h-4 w-4" />
							<span class="hidden sm:inline">Mapa</span>
						</Tabs.Trigger>
						<Tabs.Trigger value="list">
							<List class="mr-2 h-4 w-4" />
							<span class="hidden sm:inline">Lista</span>
						</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
			</div>

			<div class="rounded-lg border bg-card p-4 shadow-sm sm:p-6">
				{#if filteredTrafficLights().length === 0}
					<div class="flex flex-col items-center justify-center gap-4 py-12 text-center">
						<p class="text-muted-foreground">
							{#if searchQuery || statusFilter !== "all"}
								No se encontraron semáforos con los filtros aplicados.
							{:else}
								No hay semáforos registrados.
							{/if}
						</p>
					</div>
				{:else}
					<Tabs.Root value={viewMode}>
						<Tabs.Content value="map" class="mt-0">
							<div class="space-y-4">
								<TrafficLightsMap
									trafficLights={filteredTrafficLights()}
									onViewDetails={handleViewDetails}
								/>
							</div>
						</Tabs.Content>
						<Tabs.Content value="list" class="mt-0">
							<TrafficLightsList data={filteredTrafficLights()} onViewDetails={handleViewDetails} />
						</Tabs.Content>
					</Tabs.Root>
				{/if}
			</div>
		</section>
	{/if}
</div>

<TrafficLightDetailsDialog bind:open={detailsDialogOpen} trafficLight={selectedTrafficLight} />
