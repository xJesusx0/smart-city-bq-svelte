// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { components } from "$lib/__gen__/api_v1";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: components["schemas"]["UserWithModulesDTO"] | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
