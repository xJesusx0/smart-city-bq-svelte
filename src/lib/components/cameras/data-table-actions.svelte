<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Eye } from "@lucide/svelte";
	import type { components } from "$lib/__gen__/api_v1";

	type TrafficLight = components["schemas"]["TrafficLight"];

	let {
		trafficLight,
		onViewDetails
	}: {
		trafficLight: TrafficLight;
		onViewDetails?: (trafficLight: TrafficLight) => void;
	} = $props();
</script>

<div class="flex justify-end gap-2">
	<Button variant="ghost" size="sm" onclick={() => onViewDetails?.(trafficLight)}>
		<Eye class="h-4 w-4" />
	</Button>
</div>
