<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogFooter
	} from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { createCreateUserMutation, createUpdateUserMutation } from "$lib/query/users";
	import { createRolesQuery } from "$lib/query/roles";
	import type { components } from "$lib/__gen__/api_v1";

	type UserBase = components["schemas"]["UserBase"];

	let {
		open = $bindable(false),
		user = null,
		onSuccess = () => {}
	}: {
		open?: boolean;
		user?: UserBase | null;
		onSuccess?: () => void;
	} = $props();

	let isEdit = $derived(!!user);

	// Form state
	let email = $state(user?.email || "");
	let name = $state(user?.name || "");
	let identification = $state(user?.identification || "");
	let password = $state("");
	let selectedRoleIds = $state<number[]>([]);

	// Update form when user changes
	$effect(() => {
		if (user) {
			email = user.email || "";
			name = user.name || "";
			identification = user.identification || "";
			password = "";
		}
	});

	// Queries
	const rolesQuery = createRolesQuery();
	const createUserMutation = createCreateUserMutation();
	const updateUserMutation = createUpdateUserMutation();

	let roles = $derived($rolesQuery.data || []);

	function toggleRole(roleId: number) {
		if (selectedRoleIds.includes(roleId)) {
			selectedRoleIds = selectedRoleIds.filter((id) => id !== roleId);
		} else {
			selectedRoleIds = [...selectedRoleIds, roleId];
		}
	}

	async function handleSubmit() {
		try {
			if (isEdit && user) {
				// Preparar el payload de actualización
				const updatePayload: {
					email?: string | null;
					name?: string | null;
					roles?: number[] | null;
				} = {};

				if (email !== user.email) updatePayload.email = email;
				if (name !== user.name) updatePayload.name = name;
				if (selectedRoleIds.length > 0) updatePayload.roles = selectedRoleIds;

				await $updateUserMutation.mutateAsync({
					userId: user.id!,
					user: updatePayload
				});
			} else {
				if (!password) {
					alert("La contraseña es requerida para crear un usuario");
					return;
				}
				if (selectedRoleIds.length === 0) {
					alert("Debes seleccionar al menos un rol para el usuario");
					return;
				}
				await $createUserMutation.mutateAsync({
					email,
					name,
					identification,
					password,
					roles: selectedRoleIds,
					active: true
				});
			}

			open = false;
			onSuccess();

			// Reset form
			email = "";
			name = "";
			identification = "";
			password = "";
			selectedRoleIds = [];
		} catch (error) {
			console.error("Error saving user:", error);
			alert("Error al guardar el usuario");
		}
	}

	function handleClose() {
		open = false;
		// Reset form
		email = "";
		name = "";
		identification = "";
		password = "";
		selectedRoleIds = [];
	}
</script>

<Dialog bind:open>
	<DialogContent class="sm:max-w-[500px]">
		<DialogHeader>
			<DialogTitle>{isEdit ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
		</DialogHeader>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="space-y-4"
		>
			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input
					id="email"
					type="email"
					bind:value={email}
					placeholder="usuario@ejemplo.com"
					required
				/>
			</div>

			<div class="space-y-2">
				<Label for="name">Nombre</Label>
				<Input id="name" type="text" bind:value={name} placeholder="Nombre completo" required />
			</div>

			{#if !isEdit}
				<div class="space-y-2">
					<Label for="identification">Identificación</Label>
					<Input
						id="identification"
						type="text"
						bind:value={identification}
						placeholder="DNI/NIE"
						required
					/>
				</div>

				<div class="space-y-2">
					<Label for="password">Contraseña</Label>
					<Input
						id="password"
						type="password"
						bind:value={password}
						placeholder="Contraseña segura"
						required
					/>
				</div>
			{/if}

			<div class="space-y-2">
				<Label>Roles <span class="text-red-500">*</span></Label>
				<p class="text-sm text-muted-foreground">
					{#if isEdit}
						Actualiza los roles del usuario (dejar vacío para mantener los actuales)
					{:else}
						Selecciona uno o más roles para el usuario
					{/if}
				</p>
				{#if $rolesQuery.isLoading}
					<p class="text-sm text-neutral-500">Cargando roles...</p>
				{:else if $rolesQuery.isError}
					<p class="text-sm text-destructive">Error al cargar roles</p>
				{:else}
					<div class="flex flex-wrap gap-2 rounded-md border p-3">
						{#each roles as role (role.id)}
							<button
								type="button"
								class="cursor-pointer transition-all hover:scale-105"
								onclick={() => toggleRole(role.id!)}
							>
								<Badge variant={selectedRoleIds.includes(role.id!) ? "default" : "outline"}>
									{role.name}
								</Badge>
							</button>
						{/each}
					</div>
					<div class="mt-2 flex items-center gap-2">
						<p class="text-xs text-muted-foreground">
							{#if selectedRoleIds.length === 0}
								{#if isEdit}
									No hay cambios en roles
								{:else}
									Ningún rol seleccionado
								{/if}
							{:else}
								✓ Seleccionados ({selectedRoleIds.length}): {roles
									.filter((r) => selectedRoleIds.includes(r.id!))
									.map((r) => r.name)
									.join(", ")}
							{/if}
						</p>
					</div>
				{/if}
			</div>

			<DialogFooter class="gap-2">
				<Button type="button" variant="outline" onclick={handleClose}>Cancelar</Button>
				<Button
					type="submit"
					disabled={$createUserMutation.isPending ||
						$updateUserMutation.isPending ||
						(!isEdit && selectedRoleIds.length === 0)}
				>
					{#if $createUserMutation.isPending || $updateUserMutation.isPending}
						Guardando...
					{:else}
						{isEdit ? "Actualizar" : "Crear"}
					{/if}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>
