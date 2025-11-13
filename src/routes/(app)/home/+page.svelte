<script lang="ts">
	import type { PageData } from "./$types";
	import type { components } from "$lib/__gen__/api_v1";

	let { data }: { data: PageData } = $props();

	// Obtener módulos con tipo correcto
	const allowedModules = $derived(
		(data.user?.modules || []) as components["schemas"]["ModuleBase"][]
	);
</script>

<svelte:head>
	<title>Dashboard - Smart City</title>
</svelte:head>

<div class="p-8">
	<div class="mb-6">
		<h2 class="mb-2 text-3xl font-bold">
			Bienvenido{#if data.user}, {data.user.name}{/if}!
		</h2>
		<p class="text-muted-foreground">Este es el panel de control de Smart City</p>
	</div>

	<!-- Cards de módulos disponibles -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each allowedModules as module (module.id)}
			<a
				href={module.path}
				class="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
			>
				<h3 class="mb-2 text-lg font-semibold group-hover:text-primary">
					{module.name}
				</h3>
				{#if module.description}
					<p class="text-sm text-muted-foreground">
						{module.description}
					</p>
				{/if}
				<div class="mt-4 flex items-center text-sm text-primary">
					<span>Acceder</span>
					<span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
				</div>
			</a>
		{/each}
	</div>

	{#if allowedModules.length === 0}
		<div class="rounded-lg border-2 border-dashed p-8 text-center">
			<p class="text-lg">No tienes módulos asignados</p>
			<p class="mt-2 text-muted-foreground">
				Contacta con el administrador para solicitar acceso a los módulos del sistema
			</p>
		</div>
	{/if}
</div>
