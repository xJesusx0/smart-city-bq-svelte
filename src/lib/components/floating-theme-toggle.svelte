<script lang="ts">
	import { theme } from "$lib/stores/theme";
	import { Sun, Moon } from "@lucide/svelte";

	function toggleTheme() {
		theme.set($theme === "dark" ? "light" : "dark");
	}

	const themeIcon = $derived(() => {
		return $theme === "dark" ? Sun : Moon;
	});

	const ThemeIcon = $derived(themeIcon());
</script>

<!-- Componente flotante en esquina inferior derecha -->
<div class="floating-theme-toggle">
	<button onclick={toggleTheme} class="theme-button" title="Cambiar tema">
		<ThemeIcon class="theme-icon" />
	</button>
</div>

<style>
	.floating-theme-toggle {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 1000;
	}

	.theme-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		padding: 0;
		background: hsl(var(--card));
		border: 1px solid hsl(var(--border));
		border-radius: 50%;
		color: hsl(var(--foreground));
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
		backdrop-filter: blur(8px);
	}

	.theme-button:hover {
		background: hsl(var(--accent));
		border-color: hsl(var(--border));
		transform: translateY(-1px);
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
	}

	.theme-icon {
		width: 1.25rem;
		height: 1.25rem;
		transition: transform 0.2s ease;
	}

	.theme-button:hover .theme-icon {
		transform: scale(1.1);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.floating-theme-toggle {
			bottom: 1rem;
			right: 1rem;
		}

		.theme-button {
			width: 2.5rem;
			height: 2.5rem;
		}

		.theme-icon {
			width: 1rem;
			height: 1rem;
		}
	}
</style>
