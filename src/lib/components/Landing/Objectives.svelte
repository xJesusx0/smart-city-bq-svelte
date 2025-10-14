<script lang="ts">
	import * as Card from "$lib/components/ui/card";

	const objectives = [
		"Procesar video en tiempo real para identificar autos, peatones, ciclistas, etc.",
		"Analizar la información recolectada y tomar decisiones sobre los semáforos",
		"Optimizar los tiempos de luz verde/roja según la densidad de tráfico",
		"Permitir la gestión centralizada de usuarios, roles y permisos",
		"Contar con un cliente web para administración y monitoreo"
	];
</script>

<Card.Root class="mb-6">
	<Card.Header>
		<Card.Title class="text-2xl">Objetivos del Proyecto</Card.Title>
	</Card.Header>
	<Card.Content>
		<ul class="space-y-3">
			{#each objectives as objective (objective)}
				<li class="flex gap-3">
					<svg
						class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>{objective}</span>
				</li>
			{/each}
		</ul>
	</Card.Content>
</Card.Root>
