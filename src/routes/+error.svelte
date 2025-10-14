<script lang="ts">
	import { House, ArrowLeft, FileX } from "@lucide/svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";

	function goHome() {
		goto(resolve("/"));
	}

	function goBack() {
		history.back();
	}
</script>

<svelte:head>
	<title>Pagina no Encontrada - Smart City</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-background p-4">
	<div class="w-full max-w-md space-y-6">
		<!-- Icono y título -->
		<div class="text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10"
			>
				<FileX class="h-8 w-8 text-destructive" />
			</div>
			<h1 class="text-2xl font-bold text-foreground">Pagina no Encontrada</h1>
			<p class="mt-2 text-muted-foreground">La página que buscas no existe o ha sido movida</p>
		</div>

		<!-- Información del error -->
		<div class="rounded-lg border bg-card p-4 text-center">
			<p class="mb-2 text-sm text-muted-foreground">
				Verifica la URL o regresa a la página principal
			</p>
		</div>

		<!-- Acciones -->
		<div class="space-y-3">
			<Button onclick={goHome} class="w-full">
				<House class="mr-2 h-4 w-4" />
				Ir al inicio
			</Button>

			<Button onclick={goBack} variant="outline" class="w-full">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Volver atrás
			</Button>
		</div>
	</div>
</div>
