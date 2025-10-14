<script lang="ts">
	import * as Card from "$lib/components/ui/card";
</script>

<Card.Root class="mb-6 border-destructive/50">
	<Card.Header>
		<div class="flex items-center gap-2">
			<svg class="h-5 w-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
			<Card.Title class="text-2xl">Problema Central</Card.Title>
		</div>
	</Card.Header>
	<Card.Content>
		<p class="leading-relaxed">
			La congestión vehicular y los largos tiempos de espera en las principales intersecciones del
			Norte de Barranquilla, ocasionados por una gestión semafórica estática que no se adapta al
			flujo real del tráfico.
		</p>
	</Card.Content>
</Card.Root>
