<script lang="ts">
	import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";

	let { form, data } = $props();

	let email = $state("");
	let password = $state("");
	let isLoading = $state(false);
</script>

<svelte:head>
	<title>Login - Smart City</title>
</svelte:head>

<div class="login-container">
	<!-- Login form -->
	<div class="login">
		<h2>Welcome back!</h2>
		<h3>Let's get you logged in!</h3>

		<form
			class="form"
			method="POST"
			use:enhance={() => {
				isLoading = true;
				return async ({ update }) => {
					await update();
					isLoading = false;
				};
			}}
		>
			<div class="textbox">
				<input
					bind:value={email}
					required
					type="email"
					placeholder=" "
					disabled={isLoading}
					id="email-input"
					name="email"
					autocomplete="email"
				/>
				<label for="email-input">Email</label>
			</div>

			<div class="textbox">
				<input
					bind:value={password}
					required
					type="password"
					placeholder=" "
					disabled={isLoading}
					id="password-input"
					name="password"
					autocomplete="current-password"
				/>
				<label for="password-input">Contraseña</label>
			</div>

		{#if form?.error || data.error}
			<div class="error">{form?.error ?? data.error}</div>
		{/if}

			<button type="submit" disabled={isLoading}>
				{isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
			</button>

			<div class="divider">
				<span>o</span>
			</div>

			<a href={resolve("/auth/login/github")} class="btn-github">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
					/>
				</svg>
				Iniciar sesión con GitHub
			</a>
		</form>

		<p class="footer">¿Necesitas acceso? Contacta con un administrador.</p>
	</div>
</div>

<style>
	:root {
		--color-primary: #134074;
		--color-primary-hover: #13315c;
		--color-muted: #8da9c4;
	}

	.login-container {
		display: grid;
		place-items: center;
		margin: 0;
		min-height: 100vh;
		background: linear-gradient(#181624, #000000);
		color: #ffffff;
		position: relative;
		overflow: hidden;
	}

	.login {
		position: relative;
		z-index: 2;
		background: rgb(0 0 0 / 10%);
		backdrop-filter: blur(20px);
		border-radius: 24px;
		padding: 72px 32px 48px;
		width: 400px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		border: 2px solid rgb(255 255 255 / 10%);
	}

	.login h2 {
		font-size: 18px;
		margin: 0 0 6px;
		font-weight: 600;
	}

	.login h3 {
		color: var(--color-muted);
		font-size: 13px;
		margin: 0 0 42px;
		font-weight: 400;
	}

	label,
	input {
		transition: 0.3s;
	}

	.login form {
		display: grid;
		gap: 14px;
		width: 100%;
		margin: 0 0 20px;
	}

	.login :is(input, button) {
		height: 52px;
		padding: 0 12px;
		border: 0;
		border-radius: 6px;
	}

	.login .textbox {
		position: relative;
	}

	.textbox label {
		position: absolute;
		top: 50%;
		left: 12px;
		translate: 0 -50%;
		transform-origin: 0 50%;
		pointer-events: none;
		color: var(--color-muted);
		font-size: 14px;
	}

	.textbox input {
		width: 100%;
		padding-top: 10px;
		background: rgb(255 255 255 / 4%);
		outline: none;
		color: inherit;
		box-shadow: 0 0 0 2px transparent;
	}

	.textbox input:focus {
		box-shadow: 0 0 0 2px var(--color-primary);
	}

	.textbox input:is(:focus, :not(:placeholder-shown)) ~ label {
		scale: 0.725;
		translate: 0 -112%;
	}

	.login button {
		color: #f9f9f9;
		background: var(--color-primary);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.login button:hover:not(:disabled) {
		background: var(--color-primary-hover);
		transform: translateY(-1px);
	}

	.login button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.error {
		background: #fee2e2;
		color: #991b1b;
		padding: 0.75rem;
		border-radius: 6px;
		font-size: 14px;
		text-align: center;
	}

	.divider {
		position: relative;
		text-align: center;
		margin: 1rem 0;
	}

	.divider::before {
		content: "";
		position: absolute;
		left: 0;
		top: 50%;
		width: 100%;
		height: 1px;
		background: rgb(255 255 255 / 20%);
	}

	.divider span {
		position: relative;
		padding: 0 1rem;
		background: rgb(0 0 0 / 10%);
		color: var(--color-muted);
		font-size: 14px;
	}

	.btn-github {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		height: 52px;
		padding: 0 12px;
		background: #24292e;
		color: white;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 500;
		text-decoration: none;
		transition: background 0.3s ease;
	}

	.btn-github:hover {
		background: #1b1f23;
	}

	.footer {
		margin: 48px 0 0;
		font-size: 14px;
		color: var(--color-muted);
	}

	/* Responsive design */
	@media (max-width: 480px) {
		.login {
			width: 90vw;
			padding: 48px 24px 32px;
		}
	}
</style>
