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
	import { createCreateRoleMutation, createUpdateRoleMutation } from "$lib/query/roles";
	import type { components } from "$lib/__gen__/api_v1";

	type DbRole = components["schemas"]["RoleBase"];
	type RoleCreate = components["schemas"]["RoleCreate"];
	type RoleUpdate = components["schemas"]["RoleUpdate"];

	let {
		open = $bindable(false),
		role = null,
		onSuccess = () => {}
	}: {
		open?: boolean;
		role?: DbRole | null;
		onSuccess?: () => void;
	} = $props();

	const isEdit = $derived(!!role);
	let wasOpen = $state(false);

	let name = $state(role?.name || "");
	let description = $state(role?.description || "");

	const createMutation = createCreateRoleMutation();
	const updateMutation = createUpdateRoleMutation();

	$effect(() => {
		if (open && !wasOpen && role) {
			name = role.name || "";
			description = role?.description || "";
		}
		if (!open && wasOpen) {
			name = "";
			description = "";
		}
		wasOpen = open;
	});

	async function handleSubmit() {
		try {
			if (isEdit && role) {
				const payload: RoleUpdate = {};

				if (name !== role.name) payload.name = name;
				if (description !== role?.description) payload.description = description;

				await $updateMutation.mutateAsync({ roleId: role.id!, role: payload });
			} else {
				const payload: RoleCreate = {} as RoleCreate;
				payload.name = name;
				payload.description = description;
				payload.active = true;
				await $createMutation.mutateAsync(payload);
			}

			open = false;
			onSuccess();
			name = "";
			description = "";
		} catch (err) {
			console.error("Error saving role", err);
		}
	}

	function handleClose() {
		open = false;
		name = "";
		description = "";
	}
</script>

<Dialog bind:open>
	<DialogContent class="sm:max-w-[500px]">
		<DialogHeader>
			<DialogTitle>{isEdit ? "Editar Rol" : "Crear Rol"}</DialogTitle>
		</DialogHeader>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="space-y-4"
		>
			<div class="space-y-2">
				<Label for="name">Nombre</Label>
				<Input id="name" type="text" bind:value={name} required />
			</div>

			<div class="space-y-2">
				<Label for="description">Descripción</Label>
				<Input
					id="description"
					type="text"
					bind:value={description}
					placeholder="Descripción (opcional)"
				/>
			</div>

			<DialogFooter class="gap-2">
				<Button type="button" variant="outline" onclick={handleClose}>Cancelar</Button>
				<Button type="submit" disabled={$createMutation.isPending || $updateMutation.isPending}>
					{#if $createMutation.isPending || $updateMutation.isPending}
						Guardando...
					{:else}
						{isEdit ? "Actualizar" : "Crear"}
					{/if}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>
