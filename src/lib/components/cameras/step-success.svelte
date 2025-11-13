<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { CheckCircle2, Plus, Home } from "@lucide/svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import { goto } from "$app/navigation";

	let {
		handleReset,
		wizardFormState
	}: {
		handleReset: () => void;
		wizardFormState: Record<string, unknown>;
	} = $props();

	const cameraId = $derived(wizardFormState?.cameraId as string | undefined);
	const createdAt = $derived(wizardFormState?.createdAt as string | undefined);
	const neighborhoodInfo = $derived(
		wizardFormState?.neighborhoodInfo as
			| {
					neighborhood_name?: string;
					city_name?: string;
					department_name?: string;
					country_name?: string;
			  }
			| undefined
	);

	function formatDate(dateString: string | undefined) {
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
		<h3 class="mt-4 text-2xl font-semibold">¡Cámara creada exitosamente!</h3>
		<p class="mt-2 text-muted-foreground">
			La cámara ha sido registrada en el sistema correctamente.
		</p>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Detalles de la cámara</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div>
				<p class="text-sm font-medium text-muted-foreground">ID de la cámara</p>
				<p class="font-mono text-sm">{cameraId || "N/A"}</p>
			</div>
			<div>
				<p class="text-sm font-medium text-muted-foreground">Fecha de creación</p>
				<p class="text-sm">{formatDate(createdAt)}</p>
			</div>
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
			<Button onclick={handleReset}>
				<Plus class="mr-2 h-4 w-4" />
				Crear otra cámara
			</Button>
		</Card.Footer>
	</Card.Root>
</div>
