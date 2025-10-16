<script lang="ts">
	import * as Chart from "$lib/components/ui/chart/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { scaleUtc } from "d3-scale";
	import { Area, AreaChart, ChartClipPath } from "layerchart";
	import { curveNatural } from "d3-shape";
	import ChartContainer from "../ui/chart/chart-container.svelte";
	import { cubicInOut } from "svelte/easing";

	const chartData = [
		{ date: new Date("2025-08-01"), vehiculos: 185, peatones: 320 },
		{ date: new Date("2025-08-02"), vehiculos: 142, peatones: 280 },
		{ date: new Date("2025-08-03"), vehiculos: 198, peatones: 350 },
		{ date: new Date("2025-08-04"), vehiculos: 165, peatones: 290 },
		{ date: new Date("2025-08-05"), vehiculos: 220, peatones: 380 },
		{ date: new Date("2025-08-06"), vehiculos: 178, peatones: 310 },
		{ date: new Date("2025-08-07"), vehiculos: 195, peatones: 340 },
		{ date: new Date("2025-08-08"), vehiculos: 210, peatones: 360 },
		{ date: new Date("2025-08-09"), vehiculos: 155, peatones: 280 },
		{ date: new Date("2025-08-10"), vehiculos: 188, peatones: 330 },
		{ date: new Date("2025-08-11"), vehiculos: 203, peatones: 370 },
		{ date: new Date("2025-08-12"), vehiculos: 172, peatones: 300 },
		{ date: new Date("2025-08-13"), vehiculos: 225, peatones: 390 },
		{ date: new Date("2025-08-14"), vehiculos: 160, peatones: 270 },
		{ date: new Date("2025-08-15"), vehiculos: 190, peatones: 320 },
		{ date: new Date("2025-08-16"), vehiculos: 205, peatones: 350 },
		{ date: new Date("2025-08-17"), vehiculos: 175, peatones: 310 },
		{ date: new Date("2025-08-18"), vehiculos: 215, peatones: 380 },
		{ date: new Date("2025-08-19"), vehiculos: 168, peatones: 290 },
		{ date: new Date("2025-08-20"), vehiculos: 192, peatones: 340 },
		{ date: new Date("2025-08-21"), vehiculos: 180, peatones: 320 },
		{ date: new Date("2025-08-22"), vehiculos: 208, peatones: 370 },
		{ date: new Date("2025-08-23"), vehiculos: 185, peatones: 330 },
		{ date: new Date("2025-08-24"), vehiculos: 195, peatones: 350 },
		{ date: new Date("2025-08-25"), vehiculos: 170, peatones: 300 },
		{ date: new Date("2025-08-26"), vehiculos: 200, peatones: 360 },
		{ date: new Date("2025-08-27"), vehiculos: 182, peatones: 325 },
		{ date: new Date("2025-08-28"), vehiculos: 210, peatones: 375 },
		{ date: new Date("2025-08-29"), vehiculos: 165, peatones: 285 },
		{ date: new Date("2025-08-30"), vehiculos: 188, peatones: 335 },
		{ date: new Date("2025-08-31"), vehiculos: 195, peatones: 345 },
		{ date: new Date("2025-09-01"), vehiculos: 175, peatones: 315 },
		{ date: new Date("2025-09-02"), vehiculos: 205, peatones: 365 },
		{ date: new Date("2025-09-03"), vehiculos: 180, peatones: 330 },
		{ date: new Date("2025-09-04"), vehiculos: 220, peatones: 420 },
		{ date: new Date("2025-09-05"), vehiculos: 190, peatones: 340 },
		{ date: new Date("2025-09-06"), vehiculos: 200, peatones: 360 },
		{ date: new Date("2025-09-07"), vehiculos: 185, peatones: 325 },
		{ date: new Date("2025-09-08"), vehiculos: 210, peatones: 380 },
		{ date: new Date("2025-09-09"), vehiculos: 170, peatones: 300 },
		{ date: new Date("2025-09-10"), vehiculos: 195, peatones: 350 },
		{ date: new Date("2025-09-11"), vehiculos: 182, peatones: 335 },
		{ date: new Date("2025-09-12"), vehiculos: 208, peatones: 375 },
		{ date: new Date("2025-09-13"), vehiculos: 175, peatones: 320 },
		{ date: new Date("2025-09-14"), vehiculos: 200, peatones: 360 },
		{ date: new Date("2025-09-15"), vehiculos: 188, peatones: 340 },
		{ date: new Date("2025-09-16"), vehiculos: 215, peatones: 385 },
		{ date: new Date("2025-09-17"), vehiculos: 165, peatones: 290 },
		{ date: new Date("2025-09-18"), vehiculos: 192, peatones: 345 },
		{ date: new Date("2025-09-19"), vehiculos: 180, peatones: 330 },
		{ date: new Date("2025-09-20"), vehiculos: 205, peatones: 370 },
		{ date: new Date("2025-09-21"), vehiculos: 185, peatones: 335 },
		{ date: new Date("2025-09-22"), vehiculos: 195, peatones: 350 },
		{ date: new Date("2025-09-23"), vehiculos: 170, peatones: 310 },
		{ date: new Date("2025-09-24"), vehiculos: 200, peatones: 360 },
		{ date: new Date("2025-09-25"), vehiculos: 182, peatones: 325 },
		{ date: new Date("2025-09-26"), vehiculos: 210, peatones: 380 },
		{ date: new Date("2025-09-27"), vehiculos: 175, peatones: 320 },
		{ date: new Date("2025-09-28"), vehiculos: 188, peatones: 340 },
		{ date: new Date("2025-09-29"), vehiculos: 195, peatones: 350 },
		{ date: new Date("2025-09-30"), vehiculos: 180, peatones: 330 },
		{ date: new Date("2025-10-01"), vehiculos: 205, peatones: 370 },
		{ date: new Date("2025-10-02"), vehiculos: 190, peatones: 345 },
		{ date: new Date("2025-10-03"), vehiculos: 200, peatones: 360 },
		{ date: new Date("2025-10-04"), vehiculos: 185, peatones: 335 },
		{ date: new Date("2025-10-05"), vehiculos: 210, peatones: 380 },
		{ date: new Date("2025-10-06"), vehiculos: 175, peatones: 320 },
		{ date: new Date("2025-10-07"), vehiculos: 192, peatones: 345 },
		{ date: new Date("2025-10-08"), vehiculos: 180, peatones: 330 },
		{ date: new Date("2025-10-09"), vehiculos: 208, peatones: 375 },
		{ date: new Date("2025-10-10"), vehiculos: 165, peatones: 290 },
		{ date: new Date("2025-10-11"), vehiculos: 195, peatones: 350 },
		{ date: new Date("2025-10-12"), vehiculos: 182, peatones: 335 },
		{ date: new Date("2025-10-13"), vehiculos: 200, peatones: 360 },
		{ date: new Date("2025-10-14"), vehiculos: 188, peatones: 340 },
		{ date: new Date("2025-10-15"), vehiculos: 215, peatones: 385 },
		{ date: new Date("2025-10-16"), vehiculos: 170, peatones: 310 },
		{ date: new Date("2025-10-17"), vehiculos: 192, peatones: 345 },
		{ date: new Date("2025-10-18"), vehiculos: 185, peatones: 335 },
		{ date: new Date("2025-10-19"), vehiculos: 205, peatones: 370 },
		{ date: new Date("2025-10-20"), vehiculos: 180, peatones: 330 },
		{ date: new Date("2025-10-21"), vehiculos: 195, peatones: 350 },
		{ date: new Date("2025-10-22"), vehiculos: 175, peatones: 320 },
		{ date: new Date("2025-10-23"), vehiculos: 200, peatones: 360 },
		{ date: new Date("2025-10-24"), vehiculos: 182, peatones: 325 },
		{ date: new Date("2025-10-25"), vehiculos: 210, peatones: 380 },
		{ date: new Date("2025-10-26"), vehiculos: 165, peatones: 290 },
		{ date: new Date("2025-10-27"), vehiculos: 188, peatones: 340 },
		{ date: new Date("2025-10-28"), vehiculos: 195, peatones: 350 },
		{ date: new Date("2025-10-29"), vehiculos: 180, peatones: 330 },
		{ date: new Date("2025-10-30"), vehiculos: 205, peatones: 370 },
		{ date: new Date("2025-10-31"), vehiculos: 190, peatones: 345 }
	];

	let timeRange = $state("90d");

	const selectedLabel = $derived.by(() => {
		switch (timeRange) {
			case "90d":
				return "Ultimos 3 meses";
			case "30d":
				return "Ultimos 30 dias";
			case "7d":
				return "Ultimos 7 dias";
			default:
				return "Ultimos 3 meses";
		}
	});

	const filteredData = $derived(
		chartData.filter((item) => {
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const referenceDate = new Date("2025-10-31");
			let daysToSubtract = 90;
			if (timeRange === "30d") {
				daysToSubtract = 30;
			} else if (timeRange === "7d") {
				daysToSubtract = 7;
			}

			referenceDate.setDate(referenceDate.getDate() - daysToSubtract);
			return item.date >= referenceDate;
		})
	);

	const chartConfig = {
		vehiculos: { label: "Vehículos", color: "var(--chart-1)" },
		peatones: { label: "Peatones", color: "var(--chart-2)" }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root>
	<Card.Header class="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
		<div class="grid flex-1 gap-1 text-center sm:text-left">
			<Card.Title>Vehiculos - Peatones</Card.Title>
		</div>
		<Select.Root type="single" bind:value={timeRange}>
			<Select.Trigger class="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
				{selectedLabel}
			</Select.Trigger>
			<Select.Content class="rounded-xl">
				<Select.Item value="90d" class="rounded-lg">Ultimos 3 meses</Select.Item>
				<Select.Item value="30d" class="rounded-lg">Ultimos 30 dias</Select.Item>
				<Select.Item value="7d" class="rounded-lg">Ultimos 7 dias</Select.Item>
			</Select.Content>
		</Select.Root>
	</Card.Header>
	<Card.Content>
		<ChartContainer config={chartConfig} class="aspect-auto h-[250px]">
			<AreaChart
				data={filteredData}
				x="date"
				xScale={scaleUtc()}
				series={[
					{
						key: "peatones",
						label: "Peatones",
						color: chartConfig.peatones.color
					},
					{
						key: "vehiculos",
						label: "Vehículos",
						color: chartConfig.vehiculos.color
					}
				]}
				seriesLayout="stack"
				props={{
					area: {
						curve: curveNatural,
						"fill-opacity": 0.4,
						line: { class: "stroke-1" },
						motion: "tween"
					},
					xAxis: {
						ticks: timeRange === "7d" ? 7 : undefined,
						format: (v) => {
							return v.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric"
							});
						}
					},

					yAxis: { format: () => "" }
				}}
			>
				{#snippet marks({ series, getAreaProps })}
					<defs>
						<linearGradient id="fillVehiculos" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stop-color="var(--color-vehiculos)" stop-opacity={1.0} />
							<stop offset="95%" stop-color="var(--color-vehiculos)" stop-opacity={0.1} />
						</linearGradient>
						<linearGradient id="fillPeatones" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stop-color="var(--color-peatones)" stop-opacity={0.8} />
							<stop offset="95%" stop-color="var(--color-peatones)" stop-opacity={0.1} />
						</linearGradient>
					</defs>
					<ChartClipPath
						initialWidth={0}
						motion={{
							width: { type: "tween", duration: 1000, easing: cubicInOut }
						}}
					>
						{#each series as s, i (s.key)}
							<Area
								{...getAreaProps(s, i)}
								fill={s.key === "vehiculos" ? "url(#fillVehiculos)" : "url(#fillPeatones)"}
							/>
						{/each}
					</ChartClipPath>
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip
						labelFormatter={(v: Date) => {
							return v.toLocaleDateString("es-ES", {
								month: "long"
							});
						}}
						indicator="line"
					/>
				{/snippet}
			</AreaChart>
		</ChartContainer>
	</Card.Content>
</Card.Root>
