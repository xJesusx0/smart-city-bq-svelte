<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { queryClient } from "$lib/api/query-client";
	import favicon from "$lib/assets/favicon.svg";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import { onMount } from "svelte";
	import "../app.css";

	let { data: propsData, children } = $props();
	let { session, supabase } = $derived(propsData);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth");
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
	{@render children?.()}
</QueryClientProvider>
