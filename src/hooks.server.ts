import { redirect, type Handle } from "@sveltejs/kit";
import { createServerApiClient } from "$lib/api/api";

export const handle: Handle = async ({ event, resolve }) => {
	// RUTAS PÚBLICAS (sin autenticación requerida)
	const publicRoutes = ["/", "/login", "/register"];
	const isPublicRoute = publicRoutes.some((route) => event.url.pathname === route);

	const isUnauthorizedRoute = event.url.pathname === "/unauthorized";

	// Si es ruta pública, dejar pasar
	if (isPublicRoute) {
		event.locals.user = null;
		return await resolve(event);
	}

	// TODAS LAS DEMÁS RUTAS REQUIEREN AUTENTICACIÓN
	const token = event.cookies.get("auth_token");

	// Sin token → redirigir a login
	if (!token) {
		console.warn(`Acceso sin token a: ${event.url.pathname}`);
		return redirect(303, "/login");
	}

	// VALIDAR TOKEN Y OBTENER PERMISOS
	try {
		const api = createServerApiClient(token);
		const { data, error } = await api.GET("/api/auth/me");

		if (error || !data) {
			// Token inválido → limpiar y redirigir
			console.warn(`Token inválido o error en /auth/me`);
			event.cookies.delete("auth_token", { path: "/" });
			return redirect(303, "/login");
		}

		// Usuario autenticado correctamente
		event.locals.user = data;

		if (isUnauthorizedRoute) {
			return await resolve(event);
		}

		// VALIDAR PERMISOS DE RUTA
		const currentPath = event.url.pathname;

		// Verificar si el usuario tiene acceso a esta ruta
		const hasAccess = data.modules.some((module) => currentPath.startsWith(module.path));

		if (!hasAccess) {
			// Usuario autenticado pero sin permisos para esta ruta
			console.warn(`Usuario ${data.email} sin acceso a ${currentPath}`);
			console.warn(`Módulos permitidos:`, data.modules.map((m) => m.path).join(", "));
			return redirect(303, "/unauthorized");
		}

		//  Usuario tiene acceso a esta ruta
		return await resolve(event);
	} catch (err) {
		if (err && typeof err === "object" && "status" in err && "location" in err) {
			throw err;
		}

		console.error("Error validando usuario en hooks.server.ts:", err);
		event.cookies.delete("auth_token", { path: "/" });
		return redirect(303, "/login");
	}
};
