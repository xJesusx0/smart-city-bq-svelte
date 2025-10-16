<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogFooter
	} from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { createDeleteUserMutation } from "$lib/query/users";
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

	const deleteUserMutation = createDeleteUserMutation();

	async function handleDelete() {
		if (!user?.id) return;

		try {
			await $deleteUserMutation.mutateAsync(user.id);
			open = false;
			onSuccess();
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	}
</script>

<Dialog bind:open>
	<DialogContent class="sm:max-w-[425px]">
		<DialogHeader>
			<DialogTitle>Confirmar eliminación</DialogTitle>
		</DialogHeader>

		<div class="py-4">
			<p class="text-sm">
				¿Estás seguro de que deseas eliminar al usuario <strong>{user?.name}</strong>?
			</p>
			<p class="mt-2 text-sm text-muted-foreground">Esta acción no se puede deshacer.</p>
		</div>

		<DialogFooter class="gap-2">
			<Button type="button" variant="outline" onclick={() => (open = false)}>Cancelar</Button>
			<Button
				type="button"
				variant="destructive"
				onclick={handleDelete}
				disabled={$deleteUserMutation.isPending}
			>
				{#if $deleteUserMutation.isPending}
					Eliminando...
				{:else}
					Eliminar
				{/if}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
