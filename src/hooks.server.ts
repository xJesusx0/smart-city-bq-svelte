import { createServerApiClient } from "$lib/api/api";
import { TOKEN_KEY } from "$lib/api/const";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const publicRoutes = ["/", "/login", "/register", "/404", "/logout"];

	const pathName = event.url.pathname;
	const routeId = event.route.id;

	const isPublicRoute = publicRoutes.some((route) => pathName === route);
	const isUnauthorizedRoute = pathName === "/unauthorized";

	if (!routeId) {
		throw redirect(303, "/404");
	}

	// Si es ruta pública, dejar pasar
	if (isPublicRoute) {
		event.locals.user = null;
		return await resolve(event);
	}

	// TODAS LAS DEMÁS RUTAS REQUIEREN AUTENTICACIÓN
	const token = event.cookies.get(TOKEN_KEY);

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
			// Token inválido → limpiar cookie y redirigir con parámetro de limpieza
			console.warn(`Token inválido o error en /auth/me`);

			event.cookies.delete(TOKEN_KEY, { path: "/" });
			return redirect(303, "/login");
		}

		// Usuario autenticado correctamente
		event.locals.user = data;

		if (isUnauthorizedRoute) {
			return await resolve(event);
		}

		// Verificar si el usuario tiene acceso a esta ruta
		const hasAccess = data.modules.some(
			(module) => pathName.startsWith(module.path) && module.active
		);

		if (!hasAccess) {
			// Usuario autenticado pero sin permisos para esta ruta
			console.warn(`Usuario ${data.email} sin acceso a ${pathName}`);
			return redirect(303, "/unauthorized");
		}

		//  Usuario tiene acceso a esta ruta
		return await resolve(event);
	} catch (err) {
		if (err && typeof err === "object" && "status" in err && "location" in err) {
			throw err;
		}

		console.error("Error validando usuario en hooks.server.ts:", err);

		event.cookies.delete(TOKEN_KEY, { path: "/" });
		return redirect(303, "/login");
	}
};
