import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
import { apiV1 } from "$lib/api/api";
import type { components } from "$lib/__gen__/api_v1";

type DbRole = components["schemas"]["RoleWithModulesDTO"];
type RoleCreate = components["schemas"]["RoleCreate"];
type RoleUpdate = components["schemas"]["RoleUpdate"];

export const rolesKeys = {
	all: ["roles"] as const,
	lists: () => [...rolesKeys.all, "list"] as const,
	list: (filters?: { active?: boolean | null }) => [...rolesKeys.lists(), filters] as const
};

export function createRolesQuery(filters?: { active?: boolean | null }) {
	return createQuery({
		queryKey: rolesKeys.list(filters),
		queryFn: async () => {
			const { data, error } = await apiV1.GET("/api/iam/roles/with-modules", {
				params: {
					query: filters
				}
			});

			if (error) throw new Error("Error fetching roles");
			return data;
		}
	});
}

export function createCreateRoleMutation() {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: async (role: RoleCreate) => {
			const { data, error } = await apiV1.POST("/api/iam/roles", { body: role });
			if (error) throw new Error("Error creating role");
			return data as DbRole;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
		}
	});
}

export function createUpdateRoleMutation() {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: async ({ roleId, role }: { roleId: number; role: RoleUpdate }) => {
			const { data, error } = await apiV1.PUT("/api/iam/roles/{role_id}", {
				params: { path: { role_id: roleId } },
				body: role
			});
			if (error) throw new Error("Error updating role");
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
		}
	});
}

export function createGetRoleQuery(roleId: number) {
	return createQuery({
		queryKey: [...rolesKeys.all, "detail", roleId],
		queryFn: async () => {
			const { data, error } = await apiV1.GET("/api/iam/roles/{role_id}", {
				params: { path: { role_id: roleId } }
			});
			if (error) throw new Error("Error fetching role");
			return data as DbRole;
		},
		enabled: roleId > 0
	});
}

export function createDeleteRoleMutation() {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: async (roleId: number) => {
			const { error } = await apiV1.DELETE("/api/iam/roles/{role_id}", {
				params: { path: { role_id: roleId } }
			});
			if (error) throw new Error("Error deleting role");
			return true;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
		}
	});
}
