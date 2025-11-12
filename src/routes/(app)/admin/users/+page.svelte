<script lang="ts">
	import { getUsersQuery, createUpdateUserMutation } from "$lib/query/users";
	import { Button } from "$lib/components/ui/button";
	import UserDialog from "$lib/components/admin/UserDialog.svelte";
	import DeleteUserDialog from "$lib/components/admin/DeleteUserDialog.svelte";
	import { UserPlus } from "@lucide/svelte";
	import type { components } from "$lib/__gen__/api_v1";
	import DataTable from "$lib/components/admin/users/data-table.svelte";

	type UserWithRoles = components["schemas"]["UserWithRolesDTO"];

	// State
	let showCreateDialog = false;
	let showEditDialog = false;
	let showDeleteDialog = false;
	let selectedUser: UserWithRoles | null = null;
	let filterActive: boolean | null = null;
	let activatingUserId: number | null = null;

	// Query
	$: usersQuery = getUsersQuery({ active: filterActive });
	const updateUserMutation = createUpdateUserMutation();

	$: users = $usersQuery.data || [];

	function handleCreate() {
		selectedUser = null;
		showCreateDialog = true;
	}

	function handleEdit(user: UserWithRoles) {
		selectedUser = user;
		showEditDialog = true;
	}

	function handleDelete(user: UserWithRoles) {
		selectedUser = user;
		showDeleteDialog = true;
	}

	async function handleActivate(user: UserWithRoles) {
		activatingUserId = user.id!;
		try {
			await $updateUserMutation.mutateAsync({
				userId: user.id!,
				user: { active: true }
			});
		} finally {
			activatingUserId = null;
		}
	}

	function handleSuccess() {
		$usersQuery.refetch();
	}
</script>

<div class="p-8">
	<div class="mb-8 flex items-start justify-between max-sm:flex-col max-sm:gap-y-4 sm:items-center">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Administración de Usuarios</h1>
			<p class="mt-1 text-muted-foreground">Gestiona los usuarios del sistema</p>
		</div>
		<Button onclick={handleCreate}>
			<UserPlus class="mr-2 h-4 w-4" />
			Nuevo Usuario
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

	{#if $usersQuery.isLoading}
		<div class="p-8 text-center">
			<p class="text-muted-foreground">Cargando usuarios...</p>
		</div>
	{:else if $usersQuery.isError}
		<div class="p-8 text-center">
			<p class="text-destructive">Error al cargar los usuarios</p>
			<Button variant="outline" class="mt-4" onclick={() => $usersQuery.refetch()}>
				Reintentar
			</Button>
		</div>
	{:else if users.length === 0}
		<div class="p-8 text-center">
			<p class="text-muted-foreground">No hay usuarios registrados</p>
			<Button variant="outline" class="mt-4" onclick={handleCreate}>Crear primer usuario</Button>
		</div>
	{:else}
		<DataTable
			data={users}
			onEdit={handleEdit}
			onDelete={handleDelete}
			onActivate={handleActivate}
			{activatingUserId}
		/>
	{/if}
</div>

<!-- Dialogs -->
<UserDialog bind:open={showCreateDialog} user={null} onSuccess={handleSuccess} />
<UserDialog bind:open={showEditDialog} user={selectedUser} onSuccess={handleSuccess} />
<DeleteUserDialog bind:open={showDeleteDialog} user={selectedUser} onSuccess={handleSuccess} />
