import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
import type { components } from "$lib/__gen__/api_v1";
import { apiV1 } from "$lib/api/api";

type NeighborhoodInfo = components["schemas"]["NeighborhoodInfo"];
type TrafficLight = components["schemas"]["TrafficLight"];
type CreateTrafficLightDTO = components["schemas"]["CreateTrafficLightDTO"];
type Intersection = components["schemas"]["Intersection"];

export const geoKeys = {
	all: ["geo"] as const,
	neighborhoods: () => [...geoKeys.all, "neighborhoods"] as const,
	byPoint: (lat: number, lng: number) => [...geoKeys.neighborhoods(), "point", lat, lng] as const,
	trafficLights: () => [...geoKeys.all, "traffic-lights"] as const,
	intersections: (lat: number, lng: number, radius: number) =>
		[...geoKeys.all, "intersections", lat, lng, radius] as const
};

export function getNeighborhoodByPoint(lat: number, lng: number) {
	return createQuery({
		queryKey: geoKeys.byPoint(lat, lng),
		queryFn: async () => {
			const { data, error, response } = await apiV1.GET("/api/geo/neighborhoods/point", {
				params: {
					query: {
						latitude: lat,
						longitude: lng
					}
				}
			});

			if (error) {
				// Si es un 404, significa que no se encontró la ubicación
				if (response.status === 404) {
					throw new Error("No se encontró la ubicación solicitada");
				}
				throw new Error("Error al obtener información del barrio");
			}

			// Verificar si la respuesta tiene un mensaje de error (aunque sea 200)
			if (data && typeof data === "object" && "message" in data) {
				const errorData = data as { message?: string; context?: unknown };
				if (errorData.message) {
					throw new Error(errorData.message);
				}
			}

			// Verificar que tenga al menos un campo de información geográfica
			const neighborhoodData = data as NeighborhoodInfo;
			if (!neighborhoodData.neighborhood_id && !neighborhoodData.neighborhood_name) {
				throw new Error("No se encontró información geográfica para esta ubicación");
			}

			return neighborhoodData;
		},
		enabled: lat !== 0 && lng !== 0 && !isNaN(lat) && !isNaN(lng)
	});
}

export function getTrafficLightsQuery(filters?: {
	name?: string | null;
	intersection_id?: number | null;
	longitude?: number | null;
	latitude?: number | null;
}) {
	return createQuery({
		queryKey: [...geoKeys.trafficLights(), filters],
		queryFn: async () => {
			const { data, error } = await apiV1.GET("/api/geo/traffic-lights", {
				params: {
					query: filters
				}
			});

			if (error) {
				throw new Error("Error al obtener los semáforos");
			}

			return (data || []).filter(Boolean) as TrafficLight[];
		}
	});
}

export function getIntersectionsByPointQuery(lat: number, lng: number, radius: number) {
	return createQuery({
		queryKey: geoKeys.intersections(lat, lng, radius),
		queryFn: async () => {
			const { data, error } = await apiV1.GET("/api/geo/intersections", {
				params: {
					query: {
						latitude: lat,
						longitude: lng,
						radius
					}
				}
			});

			if (error) {
				throw new Error("Error al obtener intersecciones cercanas");
			}

			return (data || []) as Intersection[];
		},
		enabled: lat !== 0 && lng !== 0 && radius > 0 && !isNaN(lat) && !isNaN(lng)
	});
}

export function createTrafficLightMutation() {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: async (payload: CreateTrafficLightDTO) => {
			const { data, error } = await apiV1.POST("/api/geo/traffic-lights", {
				body: payload
			});

			if (error) {
				throw new Error("Error al crear el semáforo");
			}

			return data as TrafficLight;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: geoKeys.trafficLights() });
		}
	});
}
