<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { loginUser } from "$lib/hooks/auth";

	let username = "";
	let password = "";

	const login = loginUser();

	function onSubmit(event: Event) {
		event.preventDefault();

		$login.mutate(
			{
				username,
				password,
				scope: "login",
				client_id: null,
				client_secret: null,
				grant_type: "password"
			},
			{
				onSuccess: () => goto(resolve("/dashboard")),
				onError: (error) => console.log(error)
			}
		);
	}
</script>

<svelte:head>
	<title>Login - Smart City</title>
</svelte:head>

<div class="login-container">
	<!-- Login form -->
	<div class="login">
		<h2>Welcome back!</h2>
		<h3>Let's get you logged in!</h3>

		<form class="form" on:submit={onSubmit}>
			<div class="textbox">
				<input
					bind:value={username}
					required
					type="text"
					placeholder=" "
					disabled={$login.isPending}
					id="username-input"
				/>
				<label for="username-input">Username</label>
			</div>

			<div class="textbox">
				<input
					bind:value={password}
					required
					type="password"
					placeholder=" "
					disabled={$login.isPending}
					id="password-input"
				/>
				<label for="password-input">Password</label>
			</div>

			{#if $login.status === "error"}
				<div class="error">{!!$login.error && "Login failed"}</div>
			{/if}

			<button type="submit" disabled={$login.isPending}>
				{$login.isPending ? "Logging in..." : "Login"}
			</button>
		</form>

		<p class="footer">
			Don't have an account? <a href={resolve("/register")}>Register!</a>
		</p>
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

	.login a {
		font-size: 14px;
		color: var(--color-primary);
		text-decoration: none;
		margin-bottom: 20px;
		transition: color 0.3s ease;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.login a:hover {
		color: var(--color-primary-hover);
	}

	.login p {
		margin: 48px 0 0;
		font-size: 14px;
		color: var(--color-muted);
	}

	.login p a {
		color: var(--color-primary);
		text-decoration: none;
		margin: 0;
	}

	.login p a:hover {
		color: var(--color-primary-hover);
	}

	/* Responsive design */
	@media (max-width: 480px) {
		.login {
			width: 90vw;
			padding: 48px 24px 32px;
		}
	}
</style>
