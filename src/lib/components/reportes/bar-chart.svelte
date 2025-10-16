<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Chart from "$lib/components/ui/chart/index.js";
	import { scaleBand } from "d3-scale";
	import { BarChart, type ChartContextValue } from "layerchart";
	import { cubicInOut } from "svelte/easing";

	const chartData = [
		{ month: "Agosto", vehiculos: 300, peatones: 250 },
		{ month: "Septiembre", vehiculos: 300, peatones: 100 },
		{ month: "Octubre", vehiculos: 320, peatones: 280 },
		{ month: "Noviembre", vehiculos: 100, peatones: 120 },
		{ month: "Diciembre", vehiculos: 250, peatones: 200 },
		{ month: "Enero", vehiculos: 220, peatones: 180 }
	];

	const chartConfig = {
		vehiculos: { label: "Vehículos", color: "var(--chart-1)" },
		peatones: { label: "Peatones", color: "var(--chart-2)" }
	} satisfies Chart.ChartConfig;

	let context = $state<ChartContextValue>();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Vehículos vs Peatones</Card.Title>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig}>
			<BarChart
				bind:context
				data={chartData}
				xScale={scaleBand().padding(0.25)}
				x="month"
				axis="x"
				series={[
					{ key: "vehiculos", label: "Vehículos", color: chartConfig.vehiculos.color },
					{ key: "peatones", label: "Peatones", color: chartConfig.peatones.color }
				]}
				x1Scale={scaleBand().paddingInner(0.2)}
				seriesLayout="group"
				rule={false}
				props={{
					bars: {
						stroke: "none",
						strokeWidth: 0,
						rounded: "all",
						initialY: context?.height,
						initialHeight: 0,
						motion: {
							y: { type: "tween", duration: 500, easing: cubicInOut },
							height: { type: "tween", duration: 500, easing: cubicInOut }
						}
					},
					highlight: { area: { fill: "none" } },
					xAxis: { format: (d) => d.slice(0, 3) }
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip indicator="dashed" />
				{/snippet}
			</BarChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
