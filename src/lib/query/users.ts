import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";
import { apiV1 } from "$lib/api/api";
import type { components } from "$lib/__gen__/api_v1";

type UserBase = components["schemas"]["UserBase"];
type UserCreate = components["schemas"]["UserCreate"];
type UserUpdate = components["schemas"]["UserUpdate"];

export const usersKeys = {
	all: ["users"] as const,
	lists: () => [...usersKeys.all, "list"] as const,
	list: (filters?: { active?: boolean | null }) => [...usersKeys.lists(), filters] as const,
	details: () => [...usersKeys.all, "detail"] as const,
	detail: (id: number) => [...usersKeys.details(), id] as const
};

export function getUsersQuery(filters?: { active?: boolean | null }) {
	return createQuery({
		queryKey: usersKeys.list(filters),
		queryFn: async () => {
			const { data, error } = await apiV1.GET("/api/iam/users/with-roles", {
				params: {
					query: filters
				}
			});

			if (error) throw new Error("Error fetching users");
			return data;
		}
	});
}

export function getUserQuery(userId: number) {
	return createQuery({
		queryKey: usersKeys.detail(userId),
		queryFn: async () => {
			const { data, error } = await apiV1.GET("/api/iam/users/{user_id}", {
				params: {
					path: { user_id: userId }
				}
			});

			if (error) throw new Error("Error fetching user");
			return data as UserBase;
		},
		enabled: userId > 0
	});
}

export function createCreateUserMutation() {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: async (user: UserCreate) => {
			const { data, error } = await apiV1.POST("/api/iam/users", {
				body: user
			});

			if (error) throw new Error("Error creating user");
			return data as UserBase;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
		}
	});
}

export function createUpdateUserMutation() {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: async ({ userId, user }: { userId: number; user: UserUpdate }) => {
			const { data, error } = await apiV1.PUT("/api/iam/users/{user_id}", {
				params: {
					path: { user_id: userId }
				},
				body: user
			});

			if (error) throw new Error("Error updating user");
			return data as UserBase;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
		}
	});
}

export function createDeleteUserMutation() {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: async (userId: number) => {
			const { error } = await apiV1.DELETE("/api/iam/users/{user_id}", {
				params: {
					path: { user_id: userId }
				}
			});

			if (error) throw new Error("Error deleting user");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
		}
	});
}
