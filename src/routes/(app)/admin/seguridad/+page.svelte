<script lang="ts">
	import type { components } from "$lib/__gen__/api_v1";
	import DeleteRoleDialog from "$lib/components/admin/DeleteRoleDialog.svelte";
	import RoleDialog from "$lib/components/admin/RoleDialog.svelte";
	import RoleModulesDialog from "$lib/components/admin/RoleModulesDialog.svelte";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from "$lib/components/ui/table";
	import { createRolesQuery, createUpdateRoleMutation } from "$lib/query/roles";
	import { Pencil, Settings, Shield, ShieldCheck, Trash2 } from "@lucide/svelte";

	type DbRole = components["schemas"]["RoleWithModulesDTO"];

	// State
	let showCreateDialog = false;
	let showEditDialog = false;
	let showModulesDialog = false;
	let showDeleteDialog = false;
	let selectedRole: DbRole | null = null;
	let filterActive: boolean | null = null;
	let activatingRoleId: number | null = null;

	// Query
	$: rolesQuery = createRolesQuery({ active: filterActive });
	const updateMutation = createUpdateRoleMutation();

	$: roles = $rolesQuery.data || [];

	function handleCreate() {
		selectedRole = null;
		showCreateDialog = true;
	}

	function handleEdit(role: DbRole) {
		selectedRole = role;
		showEditDialog = true;
	}

	function handleModules(role: DbRole) {
		selectedRole = role;
		showModulesDialog = true;
	}

	function handleDelete(role: DbRole) {
		selectedRole = role;
		showDeleteDialog = true;
	}

	async function handleActivate(role: DbRole) {
		activatingRoleId = role.id!;
		try {
			await $updateMutation.mutateAsync({ roleId: role.id!, role: { active: true } });
		} finally {
			activatingRoleId = null;
		}
	}

	function handleSuccess() {
		$rolesQuery.refetch();
	}

	function formatDate(date: string | undefined) {
		if (!date) return "N/A";
		return new Date(date).toLocaleDateString("es-ES", {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
	}
</script>

<svelte:head>
	<title>Admin - Seguridad</title>
</svelte:head>

<div class="p-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Administración de Seguridad</h1>
			<p class="mt-1 text-muted-foreground">Gestiona los roles y sus permisos de acceso</p>
		</div>
		<Button onclick={handleCreate}>
			<Shield class="mr-2 h-4 w-4" />
			Nuevo Rol
		</Button>
	</div>

	<div class="mb-4 flex gap-2">
		<Button
			variant={filterActive === null ? "default" : "outline"}
			size="sm"
			onclick={() => (filterActive = null)}
		>
			Todos
		</Button>
		<Button
			variant={filterActive === true ? "default" : "outline"}
			size="sm"
			onclick={() => (filterActive = true)}
		>
			Activos
		</Button>
		<Button
			variant={filterActive === false ? "default" : "outline"}
			size="sm"
			onclick={() => (filterActive = false)}
		>
			Inactivos
		</Button>
	</div>

	<div class="w-full overflow-x-auto rounded-lg border">
		{#if $rolesQuery.isLoading}
			<div class="p-8 text-center">
				<p class="text-muted-foreground">Cargando roles...</p>
			</div>
		{:else if $rolesQuery.isError}
			<div class="p-8 text-center">
				<p class="text-destructive">Error al cargar los roles</p>
				<Button variant="outline" class="mt-4" onclick={() => $rolesQuery.refetch()}>
					Reintentar
				</Button>
			</div>
		{:else if roles.length === 0}
			<div class="p-8 text-center">
				<p class="text-muted-foreground">No hay roles registrados</p>
				<Button variant="outline" class="mt-4" onclick={handleCreate}>Crear primer rol</Button>
			</div>
		{:else}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Nombre</TableHead>
						<TableHead>Descripción</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Módulos</TableHead>
						<TableHead>Fecha de Creación</TableHead>
						<TableHead class="text-right">Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each roles as role (role.id)}
						<TableRow>
							<TableCell class="font-medium">{role.id}</TableCell>
							<TableCell>{role.name}</TableCell>
							<TableCell>{role.description || "-"}</TableCell>
							<TableCell>
								<Badge variant={role.active ? "default" : "secondary"}>
									{role.active ? "Activo" : "Inactivo"}
								</Badge>
							</TableCell>
							<TableCell>{role.modules?.length ?? 0}</TableCell>
							<TableCell>{formatDate(role.creation_date)}</TableCell>
							<TableCell class="text-right">
								<div class="flex justify-end gap-2">
									{#if role.active}
										<Button variant="ghost" size="sm" onclick={() => handleEdit(role)}>
											<Pencil class="h-4 w-4" />
										</Button>
										<Button variant="ghost" size="sm" onclick={() => handleModules(role)}>
											<Settings class="h-4 w-4" />
										</Button>
										<Button variant="ghost" size="sm" onclick={() => handleDelete(role)}>
											<Trash2 class="h-4 w-4" />
										</Button>
									{:else}
										<Button
											variant="ghost"
											size="sm"
											title="Activar rol"
											disabled={activatingRoleId === role.id}
											onclick={() => handleActivate(role)}
										>
											<ShieldCheck class="h-4 w-4" />
											{activatingRoleId === role.id ? "Activando..." : "Activar"}
										</Button>
									{/if}
								</div>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</div>
</div>

<!-- Dialogs -->
<RoleDialog bind:open={showCreateDialog} role={null} onSuccess={handleSuccess} />
<RoleDialog bind:open={showEditDialog} role={selectedRole} onSuccess={handleSuccess} />
<RoleModulesDialog bind:open={showModulesDialog} role={selectedRole} onSuccess={handleSuccess} />
<DeleteRoleDialog bind:open={showDeleteDialog} role={selectedRole} onSuccess={handleSuccess} />
