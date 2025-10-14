import { writable, derived } from "svelte/store";
import type { components } from "$lib/__gen__/api_v1";

type UserData = components["schemas"]["UserWithModulesDTO"];
type Module = components["schemas"]["ModuleBase"];
type RoleBase = components["schemas"]["RoleBase"];

/**
 * Store del usuario autenticado
 * Se inicializa desde el servidor (locals.user) en el +layout.server.ts
 */
export const userStore = writable<UserData | null>(null);

/**
 * Store derivado: rutas permitidas del usuario
 */
export const allowedRoutes = derived(userStore, ($user) => {
	return $user?.modules.map((m) => m.path) || [];
});

/**
 * Store derivado: roles del usuario
 */
export const userRoles = derived(userStore, ($user) => {
	return $user?.roles || [];
});

/**
 * Función helper: verificar si el usuario tiene acceso a una ruta
 */
export function hasAccessToRoute(route: string): boolean {
	let user: UserData | null = null;
	userStore.subscribe((value) => (user = value))();

	if (!user) return false;
	return (
		(user as UserData).modules?.some((module: Module) => route.startsWith(module.path)) ?? false
	);
}

/**
 * Función helper: verificar si el usuario tiene un rol específico
 */
export function hasRole(roleName: string): boolean {
	let user: UserData | null = null;
	userStore.subscribe((value) => (user = value))();

	if (!user) return false;
	return (user as UserData).roles?.some((role: RoleBase) => role.name === roleName) ?? false;
}
