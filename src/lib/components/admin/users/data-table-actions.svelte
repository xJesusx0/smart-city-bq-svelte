<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Pencil, Trash2, UserCheck } from "@lucide/svelte";
	import type { components } from "$lib/__gen__/api_v1";

	type UserWithRoles = components["schemas"]["UserWithRolesDTO"];

	let {
		user,
		onEdit,
		onDelete,
		onActivate,
		activatingUserId
	}: {
		user: UserWithRoles;
		onEdit?: (user: UserWithRoles) => void;
		onDelete?: (user: UserWithRoles) => void;
		onActivate?: (user: UserWithRoles) => void;
		activatingUserId?: number | null;
	} = $props();
</script>

<div class="flex justify-end gap-2">
	{#if user.active}
		<Button variant="ghost" size="sm" onclick={() => onEdit?.(user)}>
			<Pencil class="h-4 w-4" />
		</Button>
		<Button variant="ghost" size="sm" onclick={() => onDelete?.(user)}>
			<Trash2 class="h-4 w-4" />
		</Button>
	{:else}
		<Button
			variant="ghost"
			size="sm"
			title="Activar usuario"
			disabled={activatingUserId === user.id}
			onclick={() => onActivate?.(user)}
		>
			<UserCheck class="h-4 w-4" />
			{activatingUserId === user.id ? "Activando..." : "Activar"}
		</Button>
	{/if}
</div>
