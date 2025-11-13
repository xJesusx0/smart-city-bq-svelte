<script lang="ts">
	import { WizardComponent } from "svelte-wizard";
	import StepLocation from "$lib/components/cameras/step-location.svelte";
	import StepConfirm from "$lib/components/cameras/step-confirm.svelte";
	import StepSuccess from "$lib/components/cameras/step-success.svelte";
	import { MapPin } from "@lucide/svelte";

	let stepsList = [
		{ step: StepLocation, title: "Ubicación" },
		{ step: StepConfirm, title: "Confirmación" },
		{ step: StepSuccess, title: "Completado" }
	];

	let options = $state({
		showTitles: true,
		showProgressBar: true,
		showStepCount: true,
		clickableNavigation: false,
		shouldAnimate: true,
		defaultStep: 0
	});

	let defaultFormState = {
		coordinates: null,
		neighborhoodInfo: null,
		cameraId: null,
		createdAt: null
	};

	let customClassnames = {
		activeTitleClass: "text-foreground font-semibold",
		inactiveTitleClass: "text-muted-foreground",
		activeBarItemClass: "bg-primary",
		inactiveBarItemClass: "bg-muted",
		activeStepNumberClass: "bg-primary text-primary-foreground",
		inactiveStepNumberClass: "bg-muted text-muted-foreground"
	};

	let wizardFormState = $state(defaultFormState);
	let currentIndex = $state(0);
</script>

<svelte:head>
	<title>Cámaras - Smart City</title>
</svelte:head>

<div class="p-8">
	<div class="mb-8">
		<div class="flex items-center gap-2">
			<MapPin class="h-6 w-6" />
			<h1 class="text-3xl font-bold tracking-tight">Crear Nueva Cámara</h1>
		</div>
		<p class="mt-2 text-muted-foreground">
			Completa los pasos para registrar una nueva cámara o semáforo en el sistema
		</p>
	</div>

	<div class="rounded-lg border bg-card p-6 shadow-sm">
		<WizardComponent
			{customClassnames}
			{stepsList}
			{options}
			{defaultFormState}
			bind:wizardFormState
			bind:currentIndex
		/>
	</div>
</div>
