<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import { queryClient } from "$lib/query-client";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
	{@render children?.()}
</QueryClientProvider>
