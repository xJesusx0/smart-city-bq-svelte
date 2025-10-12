<script lang="ts">
	import { resolve } from "$app/paths";

	let { data } = $props();
	const { profile } = data;

	console.log(data);
</script>

<main>
	<aside>
		<h2>Smart City</h2>
		<nav>
			<ul>
				<li><a href={resolve("/dashboard")} class="active">Dashboard</a></li>
				<li><a href={resolve("/auth/personal-data")}>Mi Perfil</a></li>
				{#if profile?.role === "admin"}
					<li><a href={resolve("/admin")}>Panel de Admin</a></li>
				{/if}
			</ul>
		</nav>

		<div class="user-info">
			<strong>{profile?.firstName} {profile?.lastName}</strong>
			<small>{profile?.email}</small>
			{#if profile?.role === "admin"}
				<span class="badge-admin">Admin</span>
			{/if}
		</div>

		<a href={resolve("/auth/logout")} class="logout">Cerrar Sesión</a>
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
		width: 250px;
		background: #1f2937;
		color: white;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
	}

	aside h2 {
		font-size: 1.3rem;
		margin-bottom: 2rem;
		font-weight: 700;
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
		display: block;
		padding: 0.5rem 1rem;
		border-radius: 6px;
	}

	aside nav a:hover,
	aside nav a.active {
		color: white;
		background: rgb(255 255 255 / 10%);
	}

	.user-info {
		margin-top: auto;
		padding: 1rem;
		background: rgb(255 255 255 / 10%);
		border-radius: 8px;
		margin-bottom: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.user-info strong {
		font-size: 0.875rem;
		color: white;
	}

	.user-info small {
		font-size: 0.75rem;
		color: #9ca3af;
	}

	.badge-admin {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		background: #dbeafe;
		color: #1e40af;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
		margin-top: 0.5rem;
		width: fit-content;
	}

	.logout {
		padding: 0.75rem 1rem;
		background: #ef4444;
		color: white;
		text-decoration: none;
		border-radius: 6px;
		text-align: center;
		transition: background 0.2s;
	}

	.logout:hover {
		background: #dc2626;
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
