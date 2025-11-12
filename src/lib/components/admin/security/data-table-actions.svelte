<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Pencil, Settings, Trash2, ShieldCheck } from "@lucide/svelte";
	import type { components } from "$lib/__gen__/api_v1";

	type DbRole = components["schemas"]["RoleWithModulesDTO"];

	let {
		role,
		onEdit,
		onModules,
		onDelete,
		onActivate,
		activatingRoleId
	}: {
		role: DbRole;
		onEdit?: (role: DbRole) => void;
		onModules?: (role: DbRole) => void;
		onDelete?: (role: DbRole) => void;
		onActivate?: (role: DbRole) => void;
		activatingRoleId?: number | null;
	} = $props();
</script>

<div class="flex justify-end gap-2">
	{#if role.active}
		<Button variant="ghost" size="sm" onclick={() => onEdit?.(role)}>
			<Pencil class="h-4 w-4" />
		</Button>
		<Button variant="ghost" size="sm" onclick={() => onModules?.(role)}>
			<Settings class="h-4 w-4" />
		</Button>
		<Button variant="ghost" size="sm" onclick={() => onDelete?.(role)}>
			<Trash2 class="h-4 w-4" />
		</Button>
	{:else}
		<Button
			variant="ghost"
			size="sm"
			title="Activar rol"
			disabled={activatingRoleId === role.id}
			onclick={() => onActivate?.(role)}
		>
			<ShieldCheck class="h-4 w-4" />
			{activatingRoleId === role.id ? "Activando..." : "Activar"}
		</Button>
	{/if}
</div>
