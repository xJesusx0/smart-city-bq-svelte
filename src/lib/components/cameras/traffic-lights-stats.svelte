<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { TrafficCone, CircleDot, Circle } from "@lucide/svelte";
	import type { components } from "$lib/__gen__/api_v1";

	type TrafficLight = components["schemas"]["TrafficLight"];

	let { trafficLights }: { trafficLights: TrafficLight[] } = $props();

	const total = $derived(trafficLights.length);
	const active = $derived(trafficLights.filter((tl) => tl.active === true).length);
	const inactive = $derived(trafficLights.filter((tl) => tl.active === false).length);
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
	<Card.Root class="group relative overflow-hidden">
		<Card.Content class="p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium">Total de semáforos</p>
					<p class="mt-2 text-3xl font-bold">{total}</p>
					<div class="mt-2 flex items-center gap-2">
						<span class="text-sm font-medium text-muted-foreground">
							Registrados en el sistema
						</span>
					</div>
				</div>
				<div class="rounded-full bg-muted/50 p-3">
					<TrafficCone class="h-6 w-6 text-muted-foreground" />
				</div>
			</div>
		</Card.Content>
		<div class="pointer-events-none absolute inset-0"></div>
	</Card.Root>

	<Card.Root class="group relative overflow-hidden">
		<Card.Content class="p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium">Semáforos activos</p>
					<p class="mt-2 text-3xl font-bold">{active}</p>
					<div class="mt-2 flex items-center gap-2">
						<span class="text-sm font-medium text-muted-foreground"> En funcionamiento </span>
					</div>
				</div>
				<div class="rounded-full bg-muted/50 p-3">
					<CircleDot class="h-6 w-6 text-muted-foreground" />
				</div>
			</div>
		</Card.Content>
		<div class="pointer-events-none absolute inset-0"></div>
	</Card.Root>

	<Card.Root class="group relative overflow-hidden">
		<Card.Content class="p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium">Semáforos inactivos</p>
					<p class="mt-2 text-3xl font-bold">{inactive}</p>
					<div class="mt-2 flex items-center gap-2">
						<span class="text-sm font-medium text-muted-foreground"> Fuera de servicio </span>
					</div>
				</div>
				<div class="rounded-full bg-muted/50 p-3">
					<Circle class="h-6 w-6 text-muted-foreground" />
				</div>
			</div>
		</Card.Content>
		<div class="pointer-events-none absolute inset-0"></div>
	</Card.Root>
</div>
