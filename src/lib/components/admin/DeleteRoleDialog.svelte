<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogFooter
	} from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { createDeleteRoleMutation } from "$lib/query/roles";
	import type { components } from "$lib/__gen__/api_v1";

	type DbRole = components["schemas"]["RoleBase"];

	let {
		open = $bindable(false),
		role = null,
		onSuccess = () => {}
	}: {
		open?: boolean;
		role?: DbRole | null;
		onSuccess?: () => void;
	} = $props();

	const deleteMutation = createDeleteRoleMutation();

	async function handleDelete() {
		if (!role) return;

		try {
			await $deleteMutation.mutateAsync(role.id!);
			open = false;
			onSuccess();
		} catch (err) {
			console.error("Error deleting role", err);
		}
	}

	function handleClose() {
		open = false;
	}
</script>

<Dialog bind:open>
	<DialogContent class="sm:max-w-[400px]">
		<DialogHeader>
			<DialogTitle>Eliminar Rol</DialogTitle>
		</DialogHeader>

		<div class="space-y-4">
			<p class="text-sm text-muted-foreground">
				¿Estás seguro de que quieres eliminar el rol <strong>"{role?.name}"</strong>?
			</p>
		</div>

		<DialogFooter class="gap-2">
			<Button type="button" variant="outline" onclick={handleClose}>Cancelar</Button>
			<Button
				type="button"
				variant="destructive"
				disabled={$deleteMutation.isPending}
				onclick={handleDelete}
			>
				{#if $deleteMutation.isPending}
					Eliminando...
				{:else}
					Eliminar
				{/if}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
