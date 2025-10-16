import { createQuery } from "@tanstack/svelte-query";
import { apiV1 } from "$lib/api/api";
import type { components } from "$lib/__gen__/api_v1";

type ModuleBase = components["schemas"]["ModuleBase"];

export const modulesKeys = {
	all: ["modules"] as const,
	lists: () => [...modulesKeys.all, "list"] as const
};

export function createModulesQuery() {
	return createQuery({
		queryKey: modulesKeys.lists(),
		queryFn: async () => {
			const { data, error } = await apiV1.GET("/api/iam/modules");
			if (error) throw new Error("Error fetching modules");
			return data as ModuleBase[];
		}
	});
}
