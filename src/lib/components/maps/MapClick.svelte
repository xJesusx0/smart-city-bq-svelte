<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from "svelte";
	import { browser } from "$app/environment";
	import { Check } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button/index.js";

	type SveafletModule = typeof import("sveaflet");

	let MapComponent: SveafletModule["Map"] | null = null;
	let TileLayerComponent: SveafletModule["TileLayer"] | null = null;
	let MarkerComponent: SveafletModule["Marker"] | null = null;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let mapInstance: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let markerInstance: any;
	let selectedCoords: { lat: number; lng: number } | null = null;

	const dispatch = createEventDispatcher<{
		confirm: { lat: number; lng: number };
	}>();

	const options = {
		center: [11.013096, -74.827679],
		zoom: 14
	};

	const tileLayerUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function handleMapClick(e: any) {
		const { lat, lng } = e.latlng;
		selectedCoords = { lat, lng };
		console.debug("Coordenadas clicadas:", selectedCoords);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function handleMarkerClick(e: any) {
		e.originalEvent?.stopPropagation();
		selectedCoords = null;
	}

	function confirmSelection() {
		if (selectedCoords) {
			dispatch("confirm", selectedCoords);
		}
	}

	let isReady = false;

	onMount(async () => {
		if (!browser) return;

		const sveaflet = await import("sveaflet");
		MapComponent = sveaflet.Map;
		TileLayerComponent = sveaflet.TileLayer;
		MarkerComponent = sveaflet.Marker;
		isReady = true;
	});

	$: if (isReady && mapInstance) {
		mapInstance.off("click", handleMapClick);
		mapInstance.on("click", handleMapClick);
	}

	$: if (isReady && markerInstance) {
		markerInstance.off("click", handleMarkerClick);
		markerInstance.on("click", handleMarkerClick);
	}

	onDestroy(() => {
		if (mapInstance) {
			mapInstance.off("click", handleMapClick);
		}
		if (markerInstance) {
			markerInstance.off("click", handleMarkerClick);
		}
	});
</script>

{#if isReady && MapComponent && TileLayerComponent && MarkerComponent}
	<div>
		<div style="width:100%; height: 500px;">
			<svelte:component this={MapComponent} {options} bind:instance={mapInstance}>
				<svelte:component this={TileLayerComponent} url={tileLayerUrl} />
				{#if selectedCoords}
					<svelte:component
						this={MarkerComponent}
						latLng={[selectedCoords.lat, selectedCoords.lng]}
						bind:instance={markerInstance}
					/>
				{/if}
			</svelte:component>
		</div>

		{#if selectedCoords}
			<Button
				variant="default"
				onclick={confirmSelection}
				disabled={!selectedCoords}
				class="mt-4 inline-flex gap-x-2"
			>
				<Check class="h-4 w-4" />
				Confirmar selección
			</Button>
		{/if}
	</div>
{:else}
	<p>Cargando mapa...</p>
{/if}
