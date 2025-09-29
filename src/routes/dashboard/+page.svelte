<main>
	<aside>
		<h2>Mi App</h2>
		<nav>
			<ul>
				<li><a href="#">Inicio</a></li>
				<li><a href="#">Dashboard</a></li>
				<li><a href="#">Reportes</a></li>
				<li><a href="#">Configuración</a></li>
			</ul>
		</nav>
	</aside>

	<section>
		<header>
			<h1>Dashboard</h1>
			<button>Acción</button>
		</header>

		<div style="border: 2px dashed #d1d5db; border-radius: 8px; padding: 2rem; text-align: center;">
			<p style="color: #6b7280;">Área vacía del Dashboard</p>
		</div>
	</section>
</main>

<style>
	main {
		display: flex;
		min-height: 100vh;
		font-family: system-ui, sans-serif;
		background: #f9fafb;
		color: #111827;
	}

	aside {
		width: 220px;
		background: #1f2937;
		color: white;
		padding: 1rem;
	}

	aside h2 {
		font-size: 1.2rem;
		margin-bottom: 1.5rem;
	}

	aside nav ul {
		list-style: none;
		padding: 0;
	}

	aside nav li {
		margin: 0.8rem 0;
	}

	aside nav a {
		color: #d1d5db;
		text-decoration: none;
		transition: color 0.2s;
	}

	aside nav a:hover {
		color: white;
	}

	section {
		flex: 1;
		padding: 2rem;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	header h1 {
		font-size: 1.5rem;
		font-weight: bold;
	}

	header button {
		background: #3b82f6;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		cursor: pointer;
	}

	header button:hover {
		background: #2563eb;
	}
</style>
