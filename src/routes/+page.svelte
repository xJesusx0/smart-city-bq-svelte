<script>
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";

	const handleLogin = () => {
		goto(resolve("/auth/login"));
	};
</script>

<div
	class="flex min-h-screen flex-col bg-[var(--color-neutral-50)] text-[var(--color-primary-700)]"
>
	<!-- Hero Section -->
	<section
		class="flex flex-col items-center justify-center bg-[var(--color-primary-500)] px-6 py-24 text-center text-white"
	>
		<h1 class="mb-4 text-5xl font-bold">Sistema Inteligente de Gestión de Semáforos</h1>
		<p class="max-w-2xl text-lg opacity-90">
			Una solución basada en <span class="font-semibold">Inteligencia Artificial</span> e
			<span class="font-semibold">IoT</span>
			para optimizar el flujo vehicular, reducir tiempos de espera y mejorar la movilidad urbana.
		</p>
		<button
			on:click={handleLogin}
			class="mt-8 rounded-xl bg-[var(--color-secondary-300)] px-6 py-3 font-semibold text-[var(--color-primary-700)] shadow-md transition-all hover:bg-white hover:text-[var(--color-primary-600)]"
		>
			Iniciar sesión
		</button>
	</section>

	<!-- About Section -->
	<section class="flex flex-col items-center px-8 py-20">
		<h2 class="mb-4 text-3xl font-bold text-[var(--color-primary-600)]">¿Qué es este proyecto?</h2>
		<p class="max-w-3xl text-center text-lg leading-relaxed opacity-80">
			El <strong>Sistema Inteligente de Gestión de Semáforos</strong> es una plataforma que utiliza
			dispositivos IoT, sensores y cámaras con procesamiento en el borde (<em>edge computing</em>)
			para recopilar datos del tráfico en tiempo real. Mediante algoritmos de
			<strong>visión artificial y aprendizaje automático</strong>, el sistema analiza la densidad
			vehicular y ajusta dinámicamente los tiempos de los semáforos, optimizando el flujo en cada
			intersección.
		</p>
	</section>

	<!-- Features Section -->
	<section class="bg-white px-8 py-20">
		<h2 class="mb-12 text-center text-3xl font-bold text-[var(--color-primary-600)]">
			Características principales
		</h2>
		<div class="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
			<div
				class="rounded-2xl bg-[var(--color-neutral-50)] p-6 shadow transition-all hover:shadow-lg"
			>
				<h3 class="mb-3 text-xl font-semibold text-[var(--color-primary-500)]">
					Análisis con IA en tiempo real
				</h3>
				<p class="opacity-80">
					Los modelos de visión por computadora detectan vehículos, peatones y congestiones,
					permitiendo ajustar los tiempos de semáforo de forma automática.
				</p>
			</div>

			<div
				class="rounded-2xl bg-[var(--color-neutral-50)] p-6 shadow transition-all hover:shadow-lg"
			>
				<h3 class="mb-3 text-xl font-semibold text-[var(--color-primary-500)]">Integración IoT</h3>
				<p class="opacity-80">
					Los semáforos están conectados mediante microcontroladores como el <strong>ESP32</strong>,
					que envían y reciben datos del servidor central para tomar decisiones inteligentes.
				</p>
			</div>

			<div
				class="rounded-2xl bg-[var(--color-neutral-50)] p-6 shadow transition-all hover:shadow-lg"
			>
				<h3 class="mb-3 text-xl font-semibold text-[var(--color-primary-500)]">
					Panel de monitoreo
				</h3>
				<p class="opacity-80">
					Una interfaz web donde los operadores pueden visualizar en tiempo real el estado de cada
					intersección, los flujos de tráfico y las alertas generadas por el sistema.
				</p>
			</div>

			<div
				class="rounded-2xl bg-[var(--color-neutral-50)] p-6 shadow transition-all hover:shadow-lg"
			>
				<h3 class="mb-3 text-xl font-semibold text-[var(--color-primary-500)]">
					Optimización adaptativa
				</h3>
				<p class="opacity-80">
					El sistema aprende con el tiempo y adapta los ciclos de los semáforos a los patrones de
					tráfico, reduciendo el consumo energético y los tiempos de espera.
				</p>
			</div>

			<div
				class="rounded-2xl bg-[var(--color-neutral-50)] p-6 shadow transition-all hover:shadow-lg"
			>
				<h3 class="mb-3 text-xl font-semibold text-[var(--color-primary-500)]">
					Alertas y estadísticas
				</h3>
				<p class="opacity-80">
					Generación de reportes y alertas sobre congestiones, fallas en sensores o cambios de
					tráfico inusuales.
				</p>
			</div>

			<div
				class="rounded-2xl bg-[var(--color-neutral-50)] p-6 shadow transition-all hover:shadow-lg"
			>
				<h3 class="mb-3 text-xl font-semibold text-[var(--color-primary-500)]">
					Escalabilidad y nube
				</h3>
				<p class="opacity-80">
					Compatible con bases de datos en la nube y APIs REST para integrar más ciudades o
					dispositivos sin necesidad de reconfigurar el sistema.
				</p>
			</div>
		</div>
	</section>

	<!-- How it Works Section -->
	<section class="bg-[var(--color-primary-600)] px-8 py-20 text-white">
		<h2 class="mb-12 text-center text-3xl font-bold">¿Cómo funciona?</h2>
		<div class="mx-auto grid max-w-5xl gap-10 text-center md:grid-cols-3">
			<div class="flex flex-col items-center">
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-secondary-300)] font-bold text-[var(--color-primary-700)]"
				>
					1
				</div>
				<h3 class="mb-2 text-xl font-semibold">Captura de datos</h3>
				<p class="opacity-90">
					Las cámaras IoT recopilan información del tráfico y la envían al servidor.
				</p>
			</div>

			<div class="flex flex-col items-center">
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-secondary-300)] font-bold text-[var(--color-primary-700)]"
				>
					2
				</div>
				<h3 class="mb-2 text-xl font-semibold">Procesamiento inteligente</h3>
				<p class="opacity-90">
					La IA analiza el flujo vehicular y detecta patrones o congestiones.
				</p>
			</div>

			<div class="flex flex-col items-center">
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-secondary-300)] font-bold text-[var(--color-primary-700)]"
				>
					3
				</div>
				<h3 class="mb-2 text-xl font-semibold">Acción automatizada</h3>
				<p class="opacity-90">
					Los semáforos ajustan sus ciclos automáticamente para mejorar la movilidad.
				</p>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="bg-white py-24 text-center">
		<h2 class="mb-6 text-4xl font-bold text-[var(--color-primary-600)]">
			Únete al futuro de la movilidad inteligente
		</h2>
		<p class="mx-auto mb-10 max-w-2xl text-lg opacity-80">
			Monitorea, analiza y controla tus semáforos de forma inteligente con una plataforma escalable
			y basada en datos reales.
		</p>
		<button
			on:click={handleLogin}
			class="rounded-xl bg-[var(--color-primary-500)] px-8 py-4 font-semibold text-white shadow-md transition-all hover:bg-[var(--color-primary-600)]"
		>
			Iniciar sesión en el sistema
		</button>
	</section>

	<!-- Footer -->
	<footer class="bg-[var(--color-primary-700)] py-6 text-center text-sm text-white">
		<p>
			© {new Date().getFullYear()} Sistema Inteligente de Semáforos — Proyecto Universitario de IoT
			e IA.
		</p>
	</footer>
</div>
