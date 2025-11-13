<script lang="ts">
	import MapClick from "$lib/components/maps/MapClick.svelte";

	let {
		handleNext,
		handleStateUpdate
	}: {
		handleNext: () => void;
		handleStateUpdate: (state: Record<string, unknown>) => void;
	} = $props();

	function handleConfirm(event: CustomEvent<{ lat: number; lng: number }>) {
		const { lat, lng } = event.detail;
		handleStateUpdate({ coordinates: { lat, lng } });
		handleNext();
	}
</script>

<div class="space-y-4">
	<div>
		<h3 class="mb-2 text-xl font-semibold">Selecciona la ubicación</h3>
		<p class="text-muted-foreground">
			Haz clic en el mapa para seleccionar la ubicación donde se instalará la cámara o semáforo.
		</p>
	</div>

	<MapClick on:confirm={handleConfirm} />
</div>
