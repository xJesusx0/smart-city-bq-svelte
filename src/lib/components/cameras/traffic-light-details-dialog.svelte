<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogDescription
	} from "$lib/components/ui/dialog/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { MapPin } from "@lucide/svelte";
	import type { components } from "$lib/__gen__/api_v1";

	type TrafficLight = components["schemas"]["TrafficLight"];

	let {
		open = $bindable(false),
		trafficLight = null
	}: {
		open?: boolean;
		trafficLight?: TrafficLight | null;
	} = $props();

	function formatDate(dateString: string | null | undefined) {
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

<Dialog bind:open>
	<DialogContent class="max-w-2xl">
		<DialogHeader>
			<DialogTitle>Detalles del semáforo</DialogTitle>
			<DialogDescription>Información completa del semáforo seleccionado</DialogDescription>
		</DialogHeader>

		{#if trafficLight}
			<div class="space-y-4">
				<Card.Root>
					<Card.Header>
						<Card.Title>Información básica</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div>
							<p class="text-sm font-medium text-muted-foreground">Identificador</p>
							<p class="font-mono text-sm">{trafficLight.key || trafficLight.id || "N/A"}</p>
						</div>
						<div>
							<p class="text-sm font-medium text-muted-foreground">Nombre</p>
							<p class="text-sm">{trafficLight.name || "Sin nombre"}</p>
						</div>
						<div>
							<p class="text-sm font-medium text-muted-foreground">Estado</p>
							<p class="text-sm">{trafficLight.active ? "Activo" : "Inactivo"}</p>
						</div>
						<div>
							<p class="text-sm font-medium text-muted-foreground">Fecha de creación</p>
							<p class="text-sm">{formatDate(trafficLight.created_at)}</p>
						</div>
						{#if trafficLight.updated_at}
							<div>
								<p class="text-sm font-medium text-muted-foreground">Última actualización</p>
								<p class="text-sm">{formatDate(trafficLight.updated_at)}</p>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>

				{#if trafficLight.latitude !== null && trafficLight.latitude !== undefined && trafficLight.longitude !== null && trafficLight.longitude !== undefined}
					<Card.Root>
						<Card.Header>
							<Card.Title>Ubicación</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-4">
							<div>
								<p class="text-sm font-medium text-muted-foreground">Coordenadas</p>
								<div class="mt-1 flex items-center gap-2">
									<MapPin class="h-4 w-4 text-muted-foreground" />
									<p class="font-mono text-sm">
										{trafficLight.latitude.toFixed(5)}, {trafficLight.longitude.toFixed(5)}
									</p>
								</div>
							</div>
							{#if trafficLight.intersection_id}
								<div>
									<p class="text-sm font-medium text-muted-foreground">ID de intersección</p>
									<p class="font-mono text-sm">{trafficLight.intersection_id}</p>
								</div>
							{/if}
						</Card.Content>
					</Card.Root>
				{/if}
			</div>
		{:else}
			<p class="text-muted-foreground">No hay información disponible</p>
		{/if}
	</DialogContent>
</Dialog>
