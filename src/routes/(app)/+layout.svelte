<script lang="ts">
	import { SidebarProvider } from "$lib/components/ui/sidebar";
	import type { Snippet } from "svelte";
	import type { LayoutData } from "./$types";
	import NavigationSidebar from "$lib/components/navigation/NavigationSidebar.svelte";
	import NavigationSheet from "$lib/components/navigation/NavigationSheet.svelte";

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<SidebarProvider>
	<NavigationSidebar {data} />
	<main class="min-w-0 flex-1">
		<NavigationSheet {data} />
		{@render children()}
	</main>
</SidebarProvider>
