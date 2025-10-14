import { createQuery } from "@tanstack/svelte-query";
import { apiV1 } from "$lib/api/api";
import type { components } from "$lib/__gen__/api_v1";

type DbRole = components["schemas"]["DbRole"];

export const rolesKeys = {
	all: ["roles"] as const,
	lists: () => [...rolesKeys.all, "list"] as const
};

export function createRolesQuery() {
	return createQuery({
		queryKey: rolesKeys.lists(),
		queryFn: async () => {
			const { data, error } = await apiV1.GET("/api/iam/roles");

			if (error) throw new Error("Error fetching roles");
			return data as DbRole[];
		}
	});
}
