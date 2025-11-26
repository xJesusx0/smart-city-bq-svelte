<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { CheckCircle2, Plus, Home, MapPin, TrafficCone } from "@lucide/svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import { goto } from "$app/navigation";
	import type { components } from "$lib/__gen__/api_v1";

	let {
		handleReset,
		wizardFormState
	}: {
		handleReset: () => void;
		wizardFormState: Record<string, unknown>;
	} = $props();

	type TrafficLight = components["schemas"]["TrafficLight"];
	type Intersection = components["schemas"]["Intersection"];
	type NeighborhoodInfo = components["schemas"]["NeighborhoodInfo"];

	const trafficLight = $derived(wizardFormState?.trafficLight as TrafficLight | undefined);
	const intersection = $derived(wizardFormState?.intersection as Intersection | undefined);
	const neighborhoodInfo = $derived(
		wizardFormState?.neighborhoodInfo as NeighborhoodInfo | undefined
	);
	function formatDate(dateString: string | undefined | null) {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString("es-ES", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	}
</script>

<div class="space-y-4">
	<div class="text-center">
		<CheckCircle2 class="mx-auto h-16 w-16 text-green-500" />
		<h3 class="mt-4 text-2xl font-semibold">¡Semáforo creado exitosamente!</h3>
		<p class="mt-2 text-muted-foreground">
			El semáforo quedó registrado en la intersección seleccionada.
		</p>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Detalles del semáforo</Card.Title>
			<Card.Description>
				{trafficLight?.name || "Semáforo sin nombre"} · {trafficLight?.active
					? "Activo"
					: "Inactivo"}
			</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div>
				<p class="text-sm font-medium text-muted-foreground">Identificador</p>
				<p class="font-mono text-sm">{trafficLight?.key_hash || trafficLight?.id || "N/A"}</p>
			</div>
			<div>
				<p class="text-sm font-medium text-muted-foreground">Fecha de creación</p>
				<p class="text-sm">{formatDate(trafficLight?.created_at)}</p>
			</div>
			{#if intersection}
				<div>
					<p class="text-sm font-medium text-muted-foreground">Intersección asignada</p>
					<div class="mt-1 flex items-center gap-2 text-sm">
						<MapPin class="h-4 w-4 text-muted-foreground" />
						<span>{intersection?.street_a_name} × {intersection?.street_b_name}</span>
					</div>
					{#if intersection?.distance_meters !== null && intersection?.distance_meters !== undefined}
						<p class="text-xs text-muted-foreground">
							Punto seleccionado a {(intersection.distance_meters ?? 0).toFixed(1)} m
						</p>
					{/if}
				</div>
			{/if}
			{#if trafficLight?.latitude && trafficLight?.longitude}
				<div>
					<p class="text-sm font-medium text-muted-foreground">Coordenadas</p>
					<p class="font-mono text-sm">
						{trafficLight.latitude.toFixed(5)}, {trafficLight.longitude.toFixed(5)}
					</p>
				</div>
			{/if}
			{#if neighborhoodInfo}
				<div class="mt-4 border-t pt-4">
					<p class="mb-2 text-sm font-medium text-muted-foreground">Ubicación</p>
					<div class="space-y-1 text-sm">
						{#if neighborhoodInfo.neighborhood_name}
							<p>Barrio: {neighborhoodInfo.neighborhood_name}</p>
						{/if}
						{#if neighborhoodInfo.city_name}
							<p>Ciudad: {neighborhoodInfo.city_name}</p>
						{/if}
						{#if neighborhoodInfo.department_name}
							<p>Departamento: {neighborhoodInfo.department_name}</p>
						{/if}
						{#if neighborhoodInfo.country_name}
							<p>País: {neighborhoodInfo.country_name}</p>
						{/if}
					</div>
				</div>
			{/if}
		</Card.Content>
		<Card.Footer class="flex justify-between">
			<Button variant="outline" onclick={() => goto("/home")}>
				<Home class="mr-2 h-4 w-4" />
				Volver al inicio
			</Button>
			<Button variant="outline" onclick={() => goto("/cameras")}>
				<TrafficCone class="mr-2 h-4 w-4" />
				Ver semáforos
			</Button>
			<Button onclick={handleReset}>
				<Plus class="mr-2 h-4 w-4" />
				Crear otro semáforo
			</Button>
		</Card.Footer>
	</Card.Root>
</div>
