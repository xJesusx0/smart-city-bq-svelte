<script lang="ts">
	import { Arc, PieChart, Text } from "layerchart";
	import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
	import * as Chart from "$lib/components/ui/chart/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import ChartStyle from "../ui/chart/chart-style.svelte";

	const chartData = [
		{ month: "enero", vehiculos: 280, peatones: 200, color: "var(--color-enero)" },
		{ month: "febrero", vehiculos: 320, peatones: 180, color: "var(--color-febrero)" },
		{ month: "marzo", vehiculos: 290, peatones: 220, color: "var(--color-marzo)" },
		{ month: "abril", vehiculos: 310, peatones: 190, color: "var(--color-abril)" },
		{ month: "mayo", vehiculos: 250, peatones: 260, color: "var(--color-mayo)" },
		{ month: "junio", vehiculos: 330, peatones: 170, color: "var(--color-junio)" },
		{ month: "julio", vehiculos: 350, peatones: 150, color: "var(--color-julio)" },
		{ month: "agosto", vehiculos: 300, peatones: 250, color: "var(--color-agosto)" },
		{ month: "septiembre", vehiculos: 300, peatones: 100, color: "var(--color-septiembre)" },
		{ month: "octubre", vehiculos: 320, peatones: 340, color: "var(--color-octubre)" }
	];

	const chartConfig = {
		vehiculos: { label: "Vehículos" },
		peatones: { label: "Peatones" },
		enero: { label: "Enero", color: "var(--chart-1)" },
		febrero: { label: "Febrero", color: "var(--chart-2)" },
		marzo: { label: "Marzo", color: "var(--chart-3)" },
		abril: { label: "Abril", color: "var(--chart-4)" },
		mayo: { label: "Mayo", color: "var(--chart-5)" },
		junio: { label: "Junio", color: "var(--chart-6)" },
		julio: { label: "Julio", color: "var(--chart-7)" },
		agosto: { label: "Agosto", color: "var(--chart-8)" },
		septiembre: { label: "Septiembre", color: "var(--chart-9)" },
		octubre: { label: "Octubre", color: "var(--chart-10)" }
	} satisfies Chart.ChartConfig;

	let activeMonth = $state(chartData[0].month);

	const id = "pie-interactive";

	const activeIndex = $derived(chartData.findIndex((item) => item.month === activeMonth));

	const months = $derived(chartData.map((item) => item.month));

	const activeMonthData = $derived(chartData.find((item) => item.month === activeMonth));
</script>

<Card.Root data-chart={id} class="flex flex-col">
	<ChartStyle {id} config={chartConfig} />
	<Card.Header class="flex flex-row items-start space-y-0 pb-0">
		<div class="grid gap-1">
			<Card.Title>Distribución Vehículos vs Peatones</Card.Title>
			<Card.Description>Enero - Octubre 2025</Card.Description>
		</div>
		<Select.Root type="single" bind:value={activeMonth}>
			<Select.Trigger
				class="ml-auto h-7 w-[130px] rounded-lg pl-2.5 text-sm"
				aria-label="Select a value"
			>
				<span
					class="flex h-3 w-3 shrink-0 rounded-sm"
					style:background-color={`var(--color-${activeMonth})`}
				></span>
				{activeMonth
					? chartConfig[activeMonth as keyof typeof chartConfig].label
					: "Seleccionar mes"}
			</Select.Trigger>
			<Select.Content align="end" class="rounded-xl">
				{#each months as month (month)}
					{@const config = chartConfig[month as keyof typeof chartConfig]}

					{#if config}
						<Select.Item value={month} label={config.label} class="rounded-lg [&_span]:flex">
							<div class="flex items-center gap-2 text-xs">
								{config?.label}
							</div>
						</Select.Item>
					{/if}
				{/each}
			</Select.Content>
		</Select.Root>
	</Card.Header>
	<Card.Content class="flex-1">
		<Chart.Container {id} config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
			<PieChart
				data={chartData}
				label="month"
				key="month"
				value="vehiculos"
				c="color"
				props={{
					pie: {
						sort: (a, b) => {
							const monthOrder = [
								"enero",
								"febrero",
								"marzo",
								"abril",
								"mayo",
								"junio",
								"julio",
								"agosto",
								"septiembre",
								"octubre"
							];
							return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
						},
						motion: "tween"
					}
				}}
				innerRadius={60}
				padding={29}
			>
				{#snippet aboveMarks()}
					<Text
						value={activeMonthData?.vehiculos.toLocaleString() || "0"}
						textAnchor="middle"
						verticalAnchor="middle"
						class="fill-foreground !text-3xl font-bold"
						dy={3}
					/>
					<Text
						value="Vehículos"
						textAnchor="middle"
						verticalAnchor="middle"
						class="!fill-muted-foreground text-muted-foreground"
						dy={22}
					/>
				{/snippet}
				{#snippet arc({ props, index })}
					{@const isActive = index === activeIndex}
					{@const arcProps = isActive ? { ...props, outerRadius: 60, innerRadius: 105 } : props}

					{#if isActive}
						<g>
							<Arc {...arcProps} />
							<Arc {...arcProps} outerRadius={107} innerRadius={119} />
						</g>
					{:else}
						<Arc {...arcProps} />
					{/if}
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip
						labelKey="vehiculos"
						nameKey="month"
						indicator="line"
						labelFormatter={(_, payload) => {
							return chartConfig[payload?.[0].key as keyof typeof chartConfig].label;
						}}
					/>
				{/snippet}
			</PieChart>
		</Chart.Container>
	</Card.Content>
	<Card.Footer class="flex-col gap-2 text-sm">
		<div class="flex items-center gap-2 leading-none font-medium">
			{activeMonthData && activeMonthData.vehiculos > activeMonthData.peatones
				? "Más vehículos que peatones"
				: "Más peatones que vehículos"}
			<TrendingUpIcon class="size-4" />
		</div>
		<div class="leading-none text-muted-foreground">
			{activeMonthData &&
				`Vehículos: ${activeMonthData.vehiculos}, Peatones: ${activeMonthData.peatones}`}
		</div>
	</Card.Footer>
</Card.Root>
