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

	type UserBaseWithRoles = components["schemas"]["UserWithRolesDTO"];

	let {
		open = $bindable(false),
		user = null,
		onSuccess = () => {}
	}: {
		open?: boolean;
		user?: UserBaseWithRoles | null;
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
			selectedRoleIds = user.roles?.map((role) => role.id!) || [];
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
					console.error("La contraseña es requerida para crear un usuario");
					return;
				}
				if (selectedRoleIds.length === 0) {
					console.error("Debes seleccionar al menos un rol para el usuario");
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

			email = "";
			name = "";
			identification = "";
			password = "";
			selectedRoleIds = [];
		} catch (error) {
			console.error("Error saving user:", error);
		}
	}

	async function toggleActiveUser() {
		if (!user) return;
		try {
			const nextActive = !user.active;
			await $updateUserMutation.mutateAsync({
				userId: user.id!,
				user: { active: nextActive }
			});
			user = { ...user, active: nextActive } as UserBaseWithRoles;
			onSuccess();
		} catch (error) {
			console.error("Error toggling user active state:", error);
		}
	}

	function handleClose() {
		open = false;
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
						placeholder="CC/TI"
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

			{#if isEdit && user && !user.active}
				<Button
					type="button"
					variant="outline"
					onclick={toggleActiveUser}
					disabled={$updateUserMutation.isPending}
				>
					Activar usuario
				</Button>
			{/if}

			<div class="space-y-2">
				<Label>Roles</Label>
				<p class="text-sm text-muted-foreground">
					{#if isEdit}
						Actualiza los roles del usuario.
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
