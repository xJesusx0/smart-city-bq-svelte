import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

import path from "path";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, "src/lib"),
			"@components": path.resolve(__dirname, "src/lib/components"),
			"@utils": path.resolve(__dirname, "src/lib/utils")
		}
	},
	server: {
		host: true, // permite conexiones externas
		hmr: {
			protocol: "ws",
			host: "localhost",
			port: 5173
		}
	}
});
