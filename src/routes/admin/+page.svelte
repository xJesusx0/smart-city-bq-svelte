<script lang="ts">
	import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";

	const { data, form } = $props();
	const { users } = data;

	let firstName = $state("");
	let lastName = $state("");
	let email = $state("");
	let documentType = $state("");
	let document = $state("");
	let role = $state("user");

	let showPassword = $state(false);
	let generatedPassword = $state("");
	let errorMessage = $state("");
	let successMessage = $state("");

	// Manejar respuesta del formulario
	$effect(() => {
		if (form) {
			if (form.success) {
				successMessage = form.message ?? "Usuario creado exitosamente";
				generatedPassword = form.generatedPassword ?? "";
				showPassword = true;

				// Limpiar formulario
				firstName = "";
				lastName = "";
				email = "";
				documentType = "";
				document = "";
				role = "user";

				// Limpiar mensaje después de 10 segundos
				setTimeout(() => {
					showPassword = false;
					successMessage = "";
				}, 10000);
			} else if (form.error) {
				errorMessage = form.error + ": " + (form.message ?? "");
				setTimeout(() => {
					errorMessage = "";
				}, 5000);
			}
		}
	});
</script>

<svelte:head>
	<title>Panel de Administrador - Smart City</title>
</svelte:head>

<main>
	<aside>
		<h2>Admin Panel</h2>
		<nav>
			<ul>
				<li><a href={resolve("/dashboard")}>Dashboard</a></li>
				<li><a href={resolve("/admin")} class="active">Gestión de Usuarios</a></li>
			</ul>
		</nav>

		<a href={resolve("/auth/logout")} class="logout">Cerrar Sesión</a>
	</aside>

	<section class="content">
		<header>
			<h1>Gestión de Usuarios</h1>
		</header>

		<!-- Mensajes de éxito/error -->
		{#if successMessage}
			<div class="alert alert-success">
				<strong>✓ {successMessage}</strong>
			</div>
		{/if}

		{#if errorMessage}
			<div class="alert alert-error">
				<strong>✗ {errorMessage}</strong>
			</div>
		{/if}

		{#if showPassword && generatedPassword}
			<div class="alert alert-warning">
				<strong>⚠️ Contraseña generada: {generatedPassword}</strong>
				<p class="mt-2 text-sm">
					Guarda esta contraseña, no se mostrará nuevamente. El usuario puede iniciar sesión con su
					email y esta contraseña.
				</p>
			</div>
		{/if}

		<!-- Formulario para agregar usuario -->
		<div class="card">
			<h2>Agregar Nuevo Usuario</h2>
			<form method="POST" action="?/addUser" use:enhance>
				<div class="form-grid">
					<div class="form-group">
						<label for="firstName">Nombre *</label>
						<input
							type="text"
							id="firstName"
							name="firstName"
							bind:value={firstName}
							required
							placeholder="Juan"
						/>
					</div>

					<div class="form-group">
						<label for="lastName">Apellido *</label>
						<input
							type="text"
							id="lastName"
							name="lastName"
							bind:value={lastName}
							required
							placeholder="Pérez"
						/>
					</div>

					<div class="form-group">
						<label for="email">Correo Electrónico *</label>
						<input
							type="email"
							id="email"
							name="email"
							bind:value={email}
							required
							placeholder="juan.perez@example.com"
						/>
						<small>La contraseña será la parte antes del @ (ej: "juan.perez")</small>
					</div>

					<div class="form-group">
						<label for="role">Rol *</label>
						<select id="role" name="role" bind:value={role}>
							<option value="user">Usuario</option>
							<option value="admin">Administrador</option>
						</select>
					</div>

					<div class="form-group">
						<label for="documentType">Tipo de Documento</label>
						<input
							type="text"
							id="documentType"
							name="documentType"
							bind:value={documentType}
							placeholder="DNI, Pasaporte, etc."
						/>
					</div>

					<div class="form-group">
						<label for="document">Número de Documento</label>
						<input
							type="text"
							id="document"
							name="document"
							bind:value={document}
							placeholder="12345678"
						/>
					</div>
				</div>

				<button type="submit" class="btn-primary">Agregar Usuario</button>
			</form>
		</div>

		<!-- Lista de usuarios -->
		<div class="card">
			<h2>Usuarios Registrados ({users.length})</h2>
			<div class="table-container">
				<table>
					<thead>
						<tr>
							<th>Nombre</th>
							<th>Email</th>
							<th>Documento</th>
							<th>Rol</th>
							<th>Autorizado</th>
							<th>Creado</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{#each users as user}
							<tr>
								<td>{user.firstName} {user.lastName}</td>
								<td>{user.email}</td>
								<td>
									{#if user.documentType && user.document}
										{user.documentType}: {user.document}
									{:else}
										<span class="text-muted">-</span>
									{/if}
								</td>
								<td>
									<span class="badge badge-{user.role === 'admin' ? 'admin' : 'user'}">
										{user.role}
									</span>
								</td>
								<td>
									{#if user.isAuthorized}
										<span class="badge badge-success">Sí</span>
									{:else}
										<span class="badge badge-error">No</span>
									{/if}
								</td>
								<td>{new Date(user.createdAt).toLocaleDateString()}</td>
								<td>
									<form method="POST" action="?/deleteUser" use:enhance>
										<input type="hidden" name="userId" value={user.id} />
										<button
											type="submit"
											class="btn-delete"
										>
											Eliminar
										</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
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

	.logout {
		margin-top: auto;
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

	.content {
		flex: 1;
		padding: 2rem;
		max-width: 1400px;
	}

	header {
		margin-bottom: 2rem;
	}

	header h1 {
		font-size: 2rem;
		font-weight: bold;
		color: #111827;
	}

	.card {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
		margin-bottom: 2rem;
	}

	.card h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: #111827;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group label {
		font-size: 0.875rem;
		font-weight: 500;
		margin-bottom: 0.5rem;
		color: #374151;
	}

	.form-group input,
	.form-group select {
		padding: 0.625rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 0.875rem;
		transition: border-color 0.2s;
	}

	.form-group input:focus,
	.form-group select:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgb(59 130 246 / 10%);
	}

	.form-group small {
		font-size: 0.75rem;
		color: #6b7280;
		margin-top: 0.25rem;
	}

	.btn-primary {
		padding: 0.75rem 1.5rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.btn-primary:hover {
		background: #2563eb;
	}

	.btn-delete {
		padding: 0.375rem 0.75rem;
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 0.75rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.btn-delete:hover {
		background: #dc2626;
	}

	.table-container {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	th {
		text-align: left;
		padding: 0.75rem;
		background: #f9fafb;
		font-weight: 600;
		color: #374151;
		border-bottom: 2px solid #e5e7eb;
	}

	td {
		padding: 0.75rem;
		border-bottom: 1px solid #e5e7eb;
	}

	tr:hover {
		background: #f9fafb;
	}

	.badge {
		display: inline-block;
		padding: 0.25rem 0.625rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.badge-admin {
		background: #dbeafe;
		color: #1e40af;
	}

	.badge-user {
		background: #e5e7eb;
		color: #374151;
	}

	.badge-success {
		background: #d1fae5;
		color: #065f46;
	}

	.badge-error {
		background: #fee2e2;
		color: #991b1b;
	}

	.text-muted {
		color: #9ca3af;
	}

	.alert {
		padding: 1rem 1.5rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
	}

	.alert-success {
		background: #d1fae5;
		color: #065f46;
		border: 1px solid #6ee7b7;
	}

	.alert-error {
		background: #fee2e2;
		color: #991b1b;
		border: 1px solid #fca5a5;
	}

	.alert-warning {
		background: #fef3c7;
		color: #92400e;
		border: 1px solid #fcd34d;
	}

	.alert p {
		margin: 0;
	}

	.text-sm {
		font-size: 0.875rem;
	}

	.mt-2 {
		margin-top: 0.5rem;
	}

	/* Responsive */
	@media (max-width: 768px) {
		main {
			flex-direction: column;
		}

		aside {
			width: 100%;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
