<script lang="ts">
	import { queryClient } from "$lib/api/query-client";
	import favicon from "$lib/assets/favicon.svg";
	import FloatingThemeToggle from "$lib/components/floating-theme-toggle.svelte";
	import { Toaster } from "$lib/components/ui/sonner";
	import { userStore } from "$lib/stores/user";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import { ModeWatcher } from "mode-watcher";
	import { onMount, type Snippet } from "svelte";
	import "../app.css";
	import type { LayoutData } from "./$types";

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	// Inicializar store del usuario cuando el componente se monta
	onMount(() => {
		userStore.set(data.user);
	});

	$effect(() => {
		userStore.set(data.user);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
	{@render children()}
	<ModeWatcher />
	<FloatingThemeToggle />
	<Toaster richColors />
</QueryClientProvider>
