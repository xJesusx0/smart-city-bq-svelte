<script lang="ts">
	import AreaChart from "$lib/components/reportes/area-chart.svelte";
	import BarChart from "$lib/components/reportes/bar-chart.svelte";
	import PieChart from "$lib/components/reportes/pie-chart.svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Calendar, Car, Users, TrendingUp, Activity } from "@lucide/svelte";

	// Summary statistics
	const summaryStats = [
		{
			title: "Total Vehículos",
			value: "2,847",
			change: "+12.5%",
			trend: "up",
			icon: Car,
			color: "text-blue-600"
		},
		{
			title: "Total Peatones",
			value: "3,120",
			change: "+8.2%",
			trend: "up",
			icon: Users,
			color: "text-green-600"
		},
		{
			title: "Pico de Tráfico",
			value: "420",
			change: "4 Sep 2025",
			trend: "neutral",
			icon: Activity,
			color: "text-orange-600"
		},
		{
			title: "Tendencia",
			value: "Creciente",
			change: "+5.3%",
			trend: "up",
			icon: TrendingUp,
			color: "text-purple-600"
		}
	];

	let selectedPeriod = $state("90d");
	let selectedLocation = $state("all");

	const periodOptions = [
		{ value: "7d", label: "Últimos 7 días" },
		{ value: "30d", label: "Últimos 30 días" },
		{ value: "90d", label: "Últimos 3 meses" },
		{ value: "1y", label: "Último año" }
	];

	const locationOptions = [
		{ value: "all", label: "Todas las ubicaciones" },
		{ value: "center", label: "Centro de la ciudad" },
		{ value: "north", label: "Zona Norte" },
		{ value: "south", label: "Zona Sur" }
	];
</script>

<div class="min-h-screen">
	<div class="container mx-auto px-4 py-8">
		<!-- Header Section -->
		<div class="mb-8">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 class="text-4xl font-bold">Dashboard de Tráfico</h1>
					<p class="mt-2 text-lg">Análisis de vehículos y peatones en tiempo real</p>
				</div>
				<div class="flex flex-col gap-3 sm:flex-row">
					<Select.Root type="single" bind:value={selectedPeriod}>
						<Select.Trigger class="w-full sm:w-[180px]">
							<Calendar class="mr-2 h-4 w-4" />
							{periodOptions.find((opt) => opt.value === selectedPeriod)?.label ||
								"Seleccionar período"}
						</Select.Trigger>
						<Select.Content>
							{#each periodOptions as option (option.value)}
								<Select.Item value={option.value}>{option.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<Select.Root type="single" bind:value={selectedLocation}>
						<Select.Trigger class="w-full sm:w-[200px]">
							{locationOptions.find((opt) => opt.value === selectedLocation)?.label ||
								"Seleccionar ubicación"}
						</Select.Trigger>
						<Select.Content>
							{#each locationOptions as option (option.value)}
								<Select.Item value={option.value}>{option.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</div>

		<!-- Summary Statistics Cards -->
		<div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each summaryStats as stat (stat.title)}
				<Card.Root class="group relative overflow-hidden">
					<Card.Content class="p-6">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium">
									{stat.title}
								</p>
								<p class="mt-2 text-3xl font-bold">
									{stat.value}
								</p>
								<div class="mt-2 flex items-center gap-2">
									<span class="text-sm font-medium {stat.color}">
										{stat.change}
									</span>
									{#if stat.trend === "up"}
										<TrendingUp class="h-4 w-4 text-green-500" />
									{/if}
								</div>
							</div>
							<div class="rounded-full p-3">
								<stat.icon class="h-6 w-6 {stat.color}" />
							</div>
						</div>
					</Card.Content>
					<!-- Decorative gradient overlay -->
					<div class="pointer-events-none absolute inset-0"></div>
				</Card.Root>
			{/each}
		</div>

		<!-- Charts Section -->
		<div class="space-y-8">
			<!-- Main Chart - Full Width -->
			<div class="w-full">
				<AreaChart />
			</div>

			<!-- Secondary Charts Grid -->
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<BarChart />
				<PieChart />
			</div>
		</div>

		<!-- Footer Info -->
		<div class="mt-8 text-center">
			<Card.Root class="border-0">
				<Card.Content>
					<p class="text-sm">
						Última actualización: {new Date().toLocaleString("es-ES", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit"
						})}
					</p>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
