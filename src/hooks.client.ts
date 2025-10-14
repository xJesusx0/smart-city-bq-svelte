import type { HandleClientError } from "@sveltejs/kit";

/**
 * Hook del cliente que maneja errores globalmente
 */
export const handleError: HandleClientError = async ({ error }) => {
	console.error("Client error:", error);

	return {
		message: "Ocurrió un error inesperado"
	};
};
