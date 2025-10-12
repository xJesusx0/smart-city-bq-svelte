<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";

	const { data } = $props();
	const { userProfile } = data;

	let name = $state("");
	let lastName = $state("");
	let documentType = $state("");
	let document = $state("");

	$effect(() => {
		if (userProfile) {
			name = userProfile.firstName;
			lastName = userProfile.lastName;
			documentType = userProfile.documentType ?? "";
			document = userProfile.document ?? "";
		}
	});
</script>

<svelte:head>
	<title>Datos Personales - Smart City</title>
</svelte:head>

<div class="personalData-container">
	<!-- Personal Data form -->
	<div class="personalData">
		<h2>Administar Perfil!</h2>
		<h3>Actuliza tus datos!</h3>

		<form
			class="form"
			method="post"
			use:enhance={({ formData }) => {
				formData.set("firstName", name);
				formData.set("lastName", lastName);
				formData.set("documentType", documentType);
				formData.set("document", document);

				return ({ result }) => {
					if (result.type === "success") {
						goto(resolve("/dashboard"));
						// TODO: Handle success with sonner toast
					} else if (result.type === "error") {
						console.log(result.error);
						// TODO: Handle error with sonner toast
					}
				};
			}}
		>
			<div class="textbox">
				<input
					bind:value={name}
					required
					type="text"
					placeholder=" "
					id="name-input"
					name="name"
					autocomplete="given-name"
					autocapitalize="words"
					spellcheck="false"
				/>
				<label for="name-input">Nombre</label>
			</div>

			<div class="textbox">
				<input
					bind:value={lastName}
					required
					type="text"
					placeholder=" "
					id="lastName-input"
					name="lastName"
					autocomplete="family-name"
					autocapitalize="words"
					spellcheck="false"
				/>
				<label for="lastName-input">Apellido</label>
			</div>

			<div class="textbox">
				<input
					bind:value={documentType}
					required
					type="text"
					placeholder=" "
					id="documentType-input"
				/>
				<label for="documentType-input">Tipo De Documento</label>
			</div>

			<div class="textbox">
				<input
					bind:value={document}
					required
					type="number"
					min="0"
					step="1"
					placeholder=" "
					id="document-input"
					minlength={6}
				/>
				<label for="document-input">Documento</label>
			</div>

			<button type="submit"> Enviar </button>
		</form>
	</div>
</div>

<style>
	:root {
		--color-primary: #134074;
		--color-primary-hover: #13315c;
		--color-muted: #8da9c4;
	}

	.personalData-container {
		display: grid;
		place-items: center;
		margin: 0;
		min-height: 100vh;
		background: linear-gradient(#181624, #000000);
		color: #ffffff;
		position: relative;
		overflow: hidden;
	}

	.personalData {
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

	.personalData h2 {
		font-size: 18px;
		margin: 0 0 6px;
		font-weight: 600;
	}

	.personalData h3 {
		color: var(--color-muted);
		font-size: 13px;
		margin: 0 0 42px;
		font-weight: 400;
	}

	label,
	input {
		transition: 0.3s;
	}

	.personalData form {
		display: grid;
		gap: 14px;
		width: 100%;
		margin: 0 0 20px;
	}

	.personalData :is(input, button) {
		height: 52px;
		padding: 0 12px;
		border: 0;
		border-radius: 6px;
	}

	.personalData .textbox {
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

	.personalData button {
		color: #f9f9f9;
		background: var(--color-primary);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.personalData button:hover:not(:disabled) {
		background: var(--color-primary-hover);
		transform: translateY(-1px);
	}

	.personalData button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	/* Responsive design */
	@media (max-width: 480px) {
		.personalData {
			width: 90vw;
			padding: 48px 24px 32px;
		}
	}
</style>
