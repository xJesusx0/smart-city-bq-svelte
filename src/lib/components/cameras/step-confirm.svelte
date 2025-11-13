<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { getNeighborhoodByPoint } from "$lib/query/geo";
	import { ArrowLeft, Check, Loader2 } from "@lucide/svelte";
	import * as Card from "$lib/components/ui/card/index.js";

	let {
		handleBack,
		handleNext,
		wizardFormState,
		handleStateUpdate
	}: {
		handleBack: () => void;
		handleNext: () => void;
		wizardFormState: Record<string, unknown>;
		handleStateUpdate: (state: Record<string, unknown>) => void;
	} = $props();

	// Obtener coordenadas del estado
	const coordinates = $derived(
		(wizardFormState?.coordinates as { lat: number; lng: number } | undefined) || null
	);

	// Query para obtener información del barrio
	const neighborhoodQuery = $derived(
		coordinates ? getNeighborhoodByPoint(coordinates.lat, coordinates.lng) : null
	);

	// Guardar información del barrio en el estado cuando esté disponible
	$effect(() => {
		if (neighborhoodQuery && $neighborhoodQuery?.data) {
			handleStateUpdate({ neighborhoodInfo: $neighborhoodQuery.data });
		}
	});

	async function handleConfirm() {
		// Simular creación de cámara
		const cameraId = `camera_${Date.now()}`;
		const createdAt = new Date().toISOString();

		handleStateUpdate({
			cameraId,
			createdAt
		});

		handleNext();
	}
</script>

<div class="space-y-4">
	<div>
		<h3 class="mb-2 text-xl font-semibold">Confirma la información</h3>
		<p class="text-muted-foreground">
			Revisa la información geográfica obtenida para la ubicación seleccionada.
		</p>
	</div>

	{#if !coordinates}
		<Card.Root>
			<Card.Content class="p-6 text-center">
				<p class="text-muted-foreground">No hay coordenadas seleccionadas</p>
			</Card.Content>
		</Card.Root>
	{:else if neighborhoodQuery && $neighborhoodQuery?.isLoading}
		<Card.Root>
			<Card.Content class="p-6">
				<div class="flex items-center justify-center gap-2">
					<Loader2 class="h-4 w-4 animate-spin" />
					<p class="text-muted-foreground">Obteniendo información geográfica...</p>
				</div>
			</Card.Content>
		</Card.Root>
	{:else if neighborhoodQuery && $neighborhoodQuery?.isError}
		{@const errorMessage =
			$neighborhoodQuery.error?.message || "Error al obtener información geográfica"}
		<Card.Root>
			<Card.Content class="p-6">
				<div class="space-y-4">
					<p class="font-medium text-destructive">{errorMessage}</p>
					<p class="text-sm text-muted-foreground">
						Por favor, intenta seleccionar otra ubicación en el mapa.
					</p>
					<Button variant="outline" onclick={handleBack}>
						<ArrowLeft class="mr-2 h-4 w-4" />
						Volver
					</Button>
				</div>
			</Card.Content>
		</Card.Root>
	{:else if neighborhoodQuery && $neighborhoodQuery?.data}
		{@const info = $neighborhoodQuery.data}
		<Card.Root>
			<Card.Header>
				<Card.Title>Información de la ubicación</Card.Title>
				<Card.Description>
					Coordenadas: {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<p class="text-sm font-medium text-muted-foreground">Barrio</p>
						<p class="text-sm">{info.neighborhood_name || "N/A"}</p>
					</div>
					<div>
						<p class="text-sm font-medium text-muted-foreground">Ciudad</p>
						<p class="text-sm">{info.city_name || "N/A"}</p>
					</div>
					<div>
						<p class="text-sm font-medium text-muted-foreground">Departamento</p>
						<p class="text-sm">{info.department_name || "N/A"}</p>
					</div>
					<div>
						<p class="text-sm font-medium text-muted-foreground">País</p>
						<p class="text-sm">{info.country_name || "N/A"}</p>
					</div>
				</div>
			</Card.Content>
			<Card.Footer class="flex justify-between">
				<Button variant="outline" onclick={handleBack}>
					<ArrowLeft class="mr-2 h-4 w-4" />
					Volver
				</Button>
				<Button onclick={handleConfirm}>
					<Check class="mr-2 h-4 w-4" />
					Confirmar y crear
				</Button>
			</Card.Footer>
		</Card.Root>
	{/if}
</div>
