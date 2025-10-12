import { createServerClient } from "@supabase/ssr";
import { type Handle, redirect, error } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from "$env/static/public";

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: "/" });
				});
			}
		}
	});

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === "content-range" || name === "x-supabase-api-version";
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	const protectedRoutes = ["/dashboard", "/admin"];
	const adminRoutes = ["/admin"];
	const isProtected = protectedRoutes.some((route) => event.url.pathname.startsWith(route));
	const isAdminRoute = adminRoutes.some((route) => event.url.pathname.startsWith(route));

	// Redirigir a login si no está autenticado
	if (!event.locals.session && isProtected) {
		redirect(303, "/auth/login");
	}

	// Redirigir a dashboard si ya está autenticado y trata de ir a login
	if (event.locals.session && event.url.pathname === "/auth/login") {
		redirect(303, "/dashboard");
	}

	// Verificar permisos de admin para rutas administrativas
	if (isAdminRoute && event.locals.session) {
		// Importar dinámicamente para evitar ciclos
		const { db } = await import("$lib/db");
		const { profileTable } = await import("$lib/db/schema");
		const { eq } = await import("drizzle-orm");

		const profile = await db.query.profileTable.findFirst({
			where: eq(profileTable.id, event.locals.user?.id ?? "")
		});

		if (!profile || profile.role !== "admin") {
			error(403, "No tienes permisos de administrador");
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
