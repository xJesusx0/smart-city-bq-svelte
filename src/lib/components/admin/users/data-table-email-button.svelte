<script lang="ts">
	import { ArrowUpDown } from "@lucide/svelte";

	let { onclick }: { onclick?: (event: unknown) => void } = $props();
</script>

<button {onclick} class="flex h-8 cursor-pointer items-center gap-x-2 py-2">
	Email
	<ArrowUpDown class="size-4" />
</button>
