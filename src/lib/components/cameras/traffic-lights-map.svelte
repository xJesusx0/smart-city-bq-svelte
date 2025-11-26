<script lang="ts">
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import type { components } from "$lib/__gen__/api_v1";

	type TrafficLight = components["schemas"]["TrafficLight"];

	export let trafficLights: TrafficLight[] = [];

	type SveafletModule = typeof import("sveaflet");
	let MapComponent: SveafletModule["Map"] | null = null;
	let TileLayerComponent: SveafletModule["TileLayer"] | null = null;
	let MarkerComponent: SveafletModule["Marker"] | null = null;
	let TooltipComponent: SveafletModule["Tooltip"] | null = null;

	let isReady = false;

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

		isReady = true;
	});
</script>

{#if isReady && MapComponent && TileLayerComponent && MarkerComponent}
	<div>
		<div style="width: 100%; height: 520px;">
			<svelte:component this={MapComponent} options={mapOptions}>
				<svelte:component this={TileLayerComponent} url={tileLayerUrl} />

				{#each trafficLights as light (light?.id ?? light?.key_hash ?? light?.name ?? Math.random())}
					{#if light?.latitude !== null && light?.latitude !== undefined && light?.longitude !== null && light?.longitude !== undefined}
						<svelte:component this={MarkerComponent} latLng={[light.latitude, light.longitude]}>
							{#if TooltipComponent}
								<svelte:component this={TooltipComponent} permanent sticky>
									<div class="text-xs">
										<p class="font-semibold">{light?.name || "Semáforo"}</p>
										<p>Estado: {light?.active ? "Activo" : "Inactivo"}</p>
									</div>
								</svelte:component>
							{/if}
						</svelte:component>
					{/if}
				{/each}
			</svelte:component>
		</div>
	</div>
{:else}
	<div class="traffic-map-placeholder">
		<p>Cargando mapa...</p>
	</div>
{/if}

<style>
	.traffic-map-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 320px;
		border-radius: 0.75rem;
		border: 1px dashed var(--border);
		color: var(--muted-foreground);
	}
</style>
