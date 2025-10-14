// import { writable } from "svelte/store";
// import { browser } from "$app/environment";
//
// export type Theme = "light" | "dark";
//
// export const theme = writable<Theme>("dark");
//
// // Función para aplicar el tema al DOM
// function applyTheme(theme: Theme) {
// 	if (!browser) return;
//
// 	const root = document.documentElement;
//
// 	root.classList.remove("light", "dark");
//
// 	if (theme === "light") {
// 		root.classList.add("light");
// 	} else if (theme === "dark") {
// 		root.classList.add("dark");
// 	}
// }
//
// // Inicializar tema desde localStorage
// if (browser) {
// 	const storedTheme = localStorage.getItem("theme") as Theme;
// 	if (storedTheme && ["light", "dark"].includes(storedTheme)) {
// 		theme.set(storedTheme);
// 		applyTheme(storedTheme);
// 	}
// 	// Si no hay tema guardado, el CSS ya tiene oscuro por defecto
// }
//
// theme.subscribe((newTheme) => {
// 	if (!browser) return;
//
// 	applyTheme(newTheme);
// 	localStorage.setItem("theme", newTheme);
// });
