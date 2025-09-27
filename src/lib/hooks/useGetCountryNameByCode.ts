import { createQuery } from "@tanstack/svelte-query";
import { apiV1 } from "../api";

export function useGetCountryNameByCode(countryCode: string) {
	return createQuery({
		queryKey: ["country-name", countryCode],
		queryFn: async () => {
			const { data } = await apiV1.GET("/country/name", {
				params: {
					query: {
						code: countryCode
					}
				}
			});
			return data;
		}
	});
}
