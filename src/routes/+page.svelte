<script lang="ts">
	import { Separator } from "$lib/components/ui/separator";
	import Navigation from "$lib/components/Landing/navigation.svelte";
	import Header from "$lib/components/Landing/header.svelte";
	import ResearchQuestion from "$lib/components/Landing/researchQuestion.svelte";
	import CausesAndConsequences from "$lib/components/Landing/causesAndConsequences.svelte";
	import CentralProblem from "$lib/components/Landing/centralProblem.svelte";
	import Objectives from "$lib/components/Landing/Objectives.svelte";
	import Architecture from "$lib/components/Landing/architecture.svelte";
	import SystemFlow from "$lib/components/Landing/systemFlow.svelte";
</script>

<div class="min-h-screen bg-background">
	<Navigation />

	<div class="px-4max-w-full container mx-auto py-10">
		<Header />

		<Separator class="mb-8" />

		<ResearchQuestion />
		<CentralProblem />
		<CausesAndConsequences />
		<Objectives />
		<Architecture />
		<SystemFlow />
	</div>
</div>
