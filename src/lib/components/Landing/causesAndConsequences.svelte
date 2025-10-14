<script lang="ts">
	import * as Card from "$lib/components/ui/card";

	const causes = [
		"Semáforos tradicionales de tiempo fijo que no responden a variaciones en la demanda vehicular",
		"Deficiencia en infraestructura vial, generando cuellos de botella en intersecciones clave",
		"Falta de sistemas de monitoreo en tiempo real que impide tomar decisiones dinámicas"
	];

	const consequences = [
		"Aumento de los tiempos de espera en intersecciones congestionadas",
		"Estrés y pérdida de productividad para conductores",
		"Mayor contaminación ambiental por vehículos detenidos en espera",
		"Afectación en la movilidad de transporte público y servicios de emergencia"
	];
</script>

<div class="mb-6 grid gap-6 md:grid-cols-2">
	<!-- Causas -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center gap-2">
				<svg class="h-5 w-5 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
				<Card.Title>Causas</Card.Title>
			</div>
		</Card.Header>
		<Card.Content>
			<ul class="space-y-3">
				{#each causes as cause (cause)}
					<li class="flex gap-3">
						<span class="mt-1 text-chart-2">•</span>
						<span>{cause}</span>
					</li>
				{/each}
			</ul>
		</Card.Content>
	</Card.Root>

	<!-- Consecuencias -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center gap-2">
				<svg class="h-5 w-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<Card.Title>Consecuencias</Card.Title>
			</div>
		</Card.Header>
		<Card.Content>
			<ul class="space-y-3">
				{#each consequences as consequence (consequence)}
					<li class="flex gap-3">
						<span class="mt-1 text-destructive">•</span>
						<span>{consequence}</span>
					</li>
				{/each}
			</ul>
		</Card.Content>
	</Card.Root>
</div>
