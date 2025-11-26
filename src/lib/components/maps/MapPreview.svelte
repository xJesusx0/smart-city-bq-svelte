<script lang="ts">
	import { browser } from "$app/environment";
	import { onMount } from "svelte";

	type SveafletModule = typeof import("sveaflet");

	let {
		lat = null,
		lng = null,
		zoom = 16,
		height = 300
	}: {
		lat?: number | null;
		lng?: number | null;
		zoom?: number;
		height?: number;
	} = $props();

	let MapComponent = $state<SveafletModule["Map"] | null>(null);
	let TileLayerComponent = $state<SveafletModule["TileLayer"] | null>(null);
	let MarkerComponent = $state<SveafletModule["Marker"] | null>(null);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let mapInstance = $state<any>(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let markerInstance = $state<any>(null);

	let isReady = $state(false);

	const fallbackCenter: [number, number] = [11.013096, -74.827679];
	const tileLayerUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

	const hasValidCoords = $derived(
		lat !== null && lng !== null && !Number.isNaN(lat) && !Number.isNaN(lng)
	);

	onMount(async () => {
		if (!browser) return;

		const sveaflet = await import("sveaflet");
		MapComponent = sveaflet.Map;
		TileLayerComponent = sveaflet.TileLayer;
		MarkerComponent = sveaflet.Marker;
		isReady = true;
	});

	const mapOptions = $derived({
		center: hasValidCoords ? ([lat, lng] as [number, number]) : fallbackCenter,
		zoom
	});

	$effect(() => {
		if (hasValidCoords && mapInstance) {
			mapInstance.setView([lat as number, lng as number], zoom);
		}
		if (hasValidCoords && markerInstance) {
			markerInstance.setLatLng([lat as number, lng as number]);
		}
	});
</script>

{#if isReady && MapComponent && TileLayerComponent && MarkerComponent && hasValidCoords}
	<div style={`width: 100%; height: ${height}px;`}>
		<MapComponent options={mapOptions} bind:instance={mapInstance}>
			<TileLayerComponent url={tileLayerUrl} />
			<MarkerComponent latLng={[lat as number, lng as number]} bind:instance={markerInstance} />
		</MapComponent>
	</div>
{:else}
	<div class="map-preview-placeholder">
		<p>No hay coordenadas válidas</p>
	</div>
{/if}

<style>
	.map-preview-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 220px;
		border-radius: 0.5rem;
		border: 1px dashed var(--border);
		font-size: 0.875rem;
		color: var(--muted-foreground);
	}
</style>
