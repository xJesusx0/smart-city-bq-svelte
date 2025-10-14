<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { logout } from "$lib/query/auth";
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

<main class="flex min-h-screen">
	<aside class="w-64 border-r bg-card p-4">
		<h2 class="mb-4 text-xl font-bold">Smart City</h2>

		<!-- Información del usuario -->
		{#if data.user}
			<div class="mb-6 rounded-lg bg-accent p-3">
				<p class="text-sm font-medium">{data.user.name}</p>
				<p class="text-xs text-muted-foreground">{data.user.email}</p>
				{#if data.user.roles.length > 0}
					<div class="mt-2 flex flex-wrap gap-1">
						{#each data.user.roles as role (role.id)}
							<span
								class="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
								title={role.description || ""}
							>
								{role.name}
							</span>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Navegación dinámica según módulos permitidos -->
		<nav class="mb-6">
			<p class="mb-2 text-xs font-semibold text-muted-foreground uppercase">Páginas disponibles</p>
			<ul class="space-y-1">
				{#each allowedModules as module (module.id)}
					<li>
						<a
							href={module.path}
							class="block rounded px-3 py-2 text-sm transition-colors hover:bg-accent"
							title={module.description || ""}
						>
							{module.name}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<Button onclick={logout} class="w-full">Cerrar Sesión</Button>
	</aside>

	<div class="flex-1">
		<header class="border-b p-4">
			<div class="flex items-center justify-between">
				<h1 class="text-2xl font-bold">Dashboard</h1>
			</div>
		</header>

		<section class="p-8">
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
		</section>
	</div>
</main>
