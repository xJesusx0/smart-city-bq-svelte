<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import { queryClient } from "$lib/api/query-client";
	import { userStore } from "$lib/stores/user";
	import FloatingThemeToggle from "$lib/components/floating-theme-toggle.svelte";
	import type { LayoutData } from "./$types";
	import { onMount, type Snippet } from "svelte";

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
	<FloatingThemeToggle />
</QueryClientProvider>
