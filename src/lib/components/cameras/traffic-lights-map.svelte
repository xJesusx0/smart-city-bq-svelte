<script lang="ts">
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Eye } from "@lucide/svelte";
	import type { components } from "$lib/__gen__/api_v1";

	type TrafficLight = components["schemas"]["TrafficLight"];

	let {
		trafficLights,
		onViewDetails
	}: {
		trafficLights: TrafficLight[];
		onViewDetails?: (trafficLight: TrafficLight) => void;
	} = $props();

	type SveafletModule = typeof import("sveaflet");
	let MapComponent = $state<SveafletModule["Map"] | null>(null);
	let TileLayerComponent = $state<SveafletModule["TileLayer"] | null>(null);
	let MarkerComponent = $state<SveafletModule["Marker"] | null>(null);
	let TooltipComponent = $state<SveafletModule["Tooltip"] | null>(null);
	let PopupComponent = $state<SveafletModule["Popup"] | null>(null);

	let isReady = $state(false);

	const initialCenter: [number, number] = [10.987321031366932, -74.7882378101349];
	const mapOptions = {
		center: initialCenter,
		zoom: 13
	};

	const tileLayerUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

	onMount(async () => {
		if (!browser) return;

		const sveaflet = await import("sveaflet");
		MapComponent = sveaflet.Map;
		TileLayerComponent = sveaflet.TileLayer;
		MarkerComponent = sveaflet.Marker;
		TooltipComponent = sveaflet.Tooltip;
		PopupComponent = sveaflet.Popup;

		isReady = true;
	});
</script>

{#if isReady && MapComponent && TileLayerComponent && MarkerComponent}
	<div>
		<div class="traffic-map-container">
			<MapComponent options={mapOptions}>
				<TileLayerComponent url={tileLayerUrl} />

				{#each trafficLights as light, i (light?.id ?? light?.key ?? light?.name ?? i)}
					{#if light?.latitude !== null && light?.latitude !== undefined && light?.longitude !== null && light?.longitude !== undefined}
						<MarkerComponent latLng={[light.latitude, light.longitude]}>
							{#if PopupComponent}
								<PopupComponent>
									<div class="space-y-2 p-2">
										<div class="text-sm">
											<p class="font-semibold">{light?.name || "Semáforo"}</p>
											<p class="text-xs text-muted-foreground">
												Estado: {light?.active ? "Activo" : "Inactivo"}
											</p>
										</div>
										{#if onViewDetails}
											<Button
												variant="outline"
												size="sm"
												class="w-full"
												onclick={() => onViewDetails(light)}
											>
												<Eye class="mr-2 h-3 w-3" />
												Ver detalles
											</Button>
										{/if}
									</div>
								</PopupComponent>
							{:else if TooltipComponent}
								<TooltipComponent permanent sticky>
									<div class="text-xs">
										<p class="font-semibold">{light?.name || "Semáforo"}</p>
										<p>Estado: {light?.active ? "Activo" : "Inactivo"}</p>
									</div>
								</TooltipComponent>
							{/if}
						</MarkerComponent>
					{/if}
				{/each}
			</MapComponent>
		</div>
	</div>
{:else}
	<div class="traffic-map-placeholder">
		<p>Cargando mapa...</p>
	</div>
{/if}

<style>
	.traffic-map-container {
		width: 100%;
		height: 520px;
		min-height: 400px;
	}

	@media (max-width: 768px) {
		.traffic-map-container {
			height: 400px;
			min-height: 300px;
		}
	}

	.traffic-map-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 400px;
		min-height: 300px;
		border-radius: 0.75rem;
		border: 1px dashed var(--border);
		color: var(--muted-foreground);
	}
</style>
