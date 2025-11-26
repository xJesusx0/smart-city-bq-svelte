<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { ArrowLeft, Check, Loader } from "@lucide/svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import MapPreview from "$lib/components/maps/MapPreview.svelte";
	import {
		createTrafficLightMutation,
		getIntersectionsByPointQuery,
		getNeighborhoodByPoint
	} from "$lib/query/geo";
	import * as Card from "$lib/components/ui/card/index.js";
	import type { components } from "$lib/__gen__/api_v1";
	import { toast } from "svelte-sonner";

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

	type Intersection = components["schemas"]["Intersection"];
	type TrafficLight = components["schemas"]["TrafficLight"];

	const SEARCH_RADIUS_METERS = 300;

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

	const intersectionsQuery = $derived(
		coordinates
			? getIntersectionsByPointQuery(coordinates.lat, coordinates.lng, SEARCH_RADIUS_METERS)
			: null
	);

	let closestIntersection = $state<Intersection | null>(null);

	$effect(() => {
		if (intersectionsQuery && $intersectionsQuery?.data?.length) {
		closestIntersection = ($intersectionsQuery?.data || [])
			.filter((intersection) => intersection?.id)
			.sort((a, b) => {
				const distanceA = a?.distance_meters ?? Number.POSITIVE_INFINITY;
				const distanceB = b?.distance_meters ?? Number.POSITIVE_INFINITY;
				return distanceA - distanceB;
			})[0];
		} else {
			closestIntersection = null;
		}
	});

	const createTrafficLight = createTrafficLightMutation();
	let trafficLightName = $state(
		((wizardFormState?.trafficLight as TrafficLight | undefined)?.name as string | undefined) || ""
	);

	async function handleConfirm() {
		const intersection = closestIntersection;

		if (!coordinates || !intersection || !intersection.id) {
			toast.error("No hay una intersección válida para crear el semáforo.");
			return;
		}

		if (!trafficLightName.trim()) {
			toast.error("Asigna un nombre al semáforo antes de continuar.");
			return;
		}

		try {
			const trafficLight = (await $createTrafficLight.mutateAsync({
				name: trafficLightName.trim(),
				intersection_id: intersection.id,
				latitude: coordinates.lat,
				longitude: coordinates.lng
			})) as TrafficLight;

			handleStateUpdate({
				trafficLight,
				intersection,
				coordinates,
				neighborhoodInfo: $neighborhoodQuery?.data ?? null
			});

			handleNext();
		} catch (error) {
			console.error(error);
			toast.error("No se pudo crear el semáforo. Intenta nuevamente.");
		}
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
					<Loader class="h-4 w-4 animate-spin" />
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
			<Card.Content class="space-y-4">
				<div class="space-y-2">
					<p class="text-sm font-medium text-muted-foreground">
						Intersección más cercana (radio {SEARCH_RADIUS_METERS} m)
					</p>

					{#if intersectionsQuery && $intersectionsQuery?.isLoading}
						<div class="flex items-center gap-2 text-sm text-muted-foreground">
							<Loader class="h-4 w-4 animate-spin" />
							Buscando intersecciones cercanas...
						</div>
					{:else if intersectionsQuery && $intersectionsQuery?.isError}
						<p class="text-sm text-destructive">
							No pudimos obtener las intersecciones. Intenta nuevamente.
						</p>
					{:else if closestIntersection}
						<div class="rounded-md border bg-muted/40 p-4 text-sm">
							<p class="font-semibold">
								{closestIntersection?.street_a_name || "N/A"},
								{closestIntersection?.street_b_name || "N/A"}
							</p>
							{#if closestIntersection?.distance_meters !== null && closestIntersection?.distance_meters !== undefined}
								<p class="text-muted-foreground">
									A {closestIntersection.distance_meters.toFixed(1)} metros del punto seleccionado.
								</p>
							{/if}
						</div>
					{:else}
						<p class="text-sm text-destructive">
							No hay intersecciones en el radio seleccionado. Elige otra ubicación.
						</p>
					{/if}
				</div>

				<div class="space-y-2">
					<p class="text-sm font-medium text-muted-foreground">Vista previa en el mapa</p>
					<MapPreview lat={coordinates.lat} lng={coordinates.lng} height={220} />
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium text-muted-foreground" for="traffic-light-name">
						Asigna un nombre al semáforo
					</label>
					<Input
						id="traffic-light-name"
						placeholder="Ej. Semáforo Calle 84 con 53"
						bind:value={trafficLightName}
					/>
				</div>
			</Card.Content>
			<Card.Footer class="flex justify-between">
				<Button variant="outline" onclick={handleBack} disabled={$createTrafficLight.isPending}>
					<ArrowLeft class="mr-2 h-4 w-4" />
					Volver
				</Button>
				<Button
					onclick={handleConfirm}
					disabled={$createTrafficLight.isPending ||
						!trafficLightName.trim() ||
						!closestIntersection ||
						!!($intersectionsQuery?.isError || $intersectionsQuery?.isLoading)}
				>
					{#if $createTrafficLight.isPending}
						<Loader class="mr-2 h-4 w-4 animate-spin" />
						Creando...
					{:else}
						<Check class="mr-2 h-4 w-4" />
						Confirmar y crear
					{/if}
				</Button>
			</Card.Footer>
		</Card.Root>
	{/if}
</div>
