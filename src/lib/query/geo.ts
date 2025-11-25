import { createQuery } from "@tanstack/svelte-query";
import { apiV1 } from "$lib/api/api";
import type { components } from "$lib/__gen__/api_geo";

type NeighborhoodByPoint = components["schemas"]["NeighborhoodDto"];

export const geoKeys = {
	all: ["geo"] as const,
	neighborhoods: () => [...geoKeys.all, "neighborhoods"] as const,
	byPoint: (lat: number, lng: number) => [...geoKeys.neighborhoods(), "point", lat, lng] as const
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
			const neighborhoodData = data as NeighborhoodByPoint;
			if (!neighborhoodData.neighborhood_id && !neighborhoodData.neighborhood_name) {
				throw new Error("No se encontró información geográfica para esta ubicación");
			}

			return neighborhoodData;
		},
		enabled: lat !== 0 && lng !== 0 && !isNaN(lat) && !isNaN(lng)
	});
}
