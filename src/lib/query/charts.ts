import { apiV1 } from "$lib/api/api";

type MaybeNumber = number | null | undefined;

export async function getDashboardSummary(params: { location_id?: MaybeNumber } = {}) {
	const { data, error } = await apiV1.GET("/api/charts/summary", {
		params: { query: { location_id: params.location_id ?? undefined } }
	});
	if (error) throw error;
	return data!;
}

export async function getVehicleTimeline(params: { location_id?: MaybeNumber; hours: number }) {
	const { data, error } = await apiV1.GET("/api/charts/vehicle-timeline", {
		params: { query: { location_id: params.location_id ?? undefined, hours: params.hours } }
	});
	if (error) throw error;
	return data!;
}

export async function getLocationComparison() {
	const { data, error } = await apiV1.GET("/api/charts/location-comparison");
	if (error) throw error;
	return data!;
}

export async function getVehicleTypes(params: { location_id?: MaybeNumber; hours?: number } = {}) {
	const { data, error } = await apiV1.GET("/api/charts/vehicle-types", {
		params: { query: { location_id: params.location_id ?? undefined, hours: params.hours } }
	});
	if (error) throw error;
	return data!;
}

export async function getHourlyHeatmap(params: { location_id: number; days: number }) {
	const { data, error } = await apiV1.GET("/api/charts/hourly-heatmap", {
		params: { query: { location_id: params.location_id, days: params.days } }
	});
	if (error) throw error;
	return data!;
}
