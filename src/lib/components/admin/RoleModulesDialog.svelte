<script lang="ts">
	import type { components } from "$lib/__gen__/api_v1";
	import { Button } from "$lib/components/ui/button";
	import {
		Dialog,
		DialogContent,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from "$lib/components/ui/dialog";
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from "$lib/components/ui/table";
	import { createModulesQuery } from "$lib/query/modules";
	import { createUpdateRoleMutation } from "$lib/query/roles";

	type DbRole = components["schemas"]["RoleWithModulesDTO"];

	let {
		open = $bindable(false),
		role = null,
		onSuccess = () => {}
	}: {
		open?: boolean;
		role?: DbRole | null;
		onSuccess?: () => void;
	} = $props();

	// Queries
	const modulesQuery = createModulesQuery();
	const updateMutation = createUpdateRoleMutation();

	// State
	let selectedModuleIds = $state<number[]>([]);
	let initialModuleIds = $state<number[]>([]);
	let selectAll = $state(false);
	let initializedForRoleId = $state<number | null>(null);

	// Computed
	let modules = $derived($modulesQuery.data || []);
	let isAllSelected = $derived(modules.length > 0 && selectedModuleIds.length === modules.length);
	let hasChanges = $derived(
		selectedModuleIds.length !== initialModuleIds.length ||
			!selectedModuleIds.every((id) => initialModuleIds.includes(id))
	);

	// Initialize selected modules when role changes
	$effect(() => {
		// Initialize when dialog opens for a role
		if (open && role && role.id != null && modules.length > 0 && initializedForRoleId !== role.id) {
			const currentModules = role.modules || [];
			selectedModuleIds = currentModules.map((m) => m.id!).filter((id) => id != null);
			initialModuleIds = [...selectedModuleIds];
			selectAll = selectedModuleIds.length > 0 && selectedModuleIds.length === modules.length;
			initializedForRoleId = role.id!;
		}
	});

	function toggleAll() {
		selectAll = !selectAll;
		selectedModuleIds = selectAll ? modules.map((m) => m.id!) : [];
	}

	function toggleModule(id: number) {
		if (selectedModuleIds.includes(id)) {
			selectedModuleIds = selectedModuleIds.filter((i) => i !== id);
		} else {
			selectedModuleIds = [...selectedModuleIds, id];
		}
		// Update selectAll state based on current selection
		selectAll = selectedModuleIds.length === modules.length;
	}

	async function handleSubmit() {
		if (!role) return;

		// Check if there are any changes
		if (!hasChanges) {
			open = false;
			return;
		}

		try {
			await $updateMutation.mutateAsync({
				roleId: role.id!,
				role: { modules: selectedModuleIds }
			});

			open = false;
			onSuccess();
		} catch (err) {
			console.error("Error updating role modules", err);
		}
	}

	function handleClose() {
		open = false;
		selectedModuleIds = [];
		initialModuleIds = [];
		selectAll = false;
		initializedForRoleId = null;
	}
</script>

<Dialog bind:open>
	<DialogContent class="sm:max-w-[800px]">
		<DialogHeader>
			<DialogTitle>Configurar Módulos para {role?.name || "Rol"}</DialogTitle>
		</DialogHeader>

		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<p class="text-sm text-muted-foreground">
					Selecciona los módulos a los que tendrá acceso este rol
				</p>
			</div>

			{#if $modulesQuery.isLoading}
				<div class="p-8 text-center">
					<p class="text-muted-foreground">Cargando módulos...</p>
				</div>
			{:else if $modulesQuery.isError}
				<div class="p-8 text-center">
					<p class="text-destructive">Error al cargar los módulos</p>
					<Button variant="outline" class="mt-4" onclick={() => $modulesQuery.refetch()}>
						Reintentar
					</Button>
				</div>
			{:else if modules.length === 0}
				<div class="p-8 text-center">
					<p class="text-muted-foreground">No hay módulos disponibles</p>
				</div>
			{:else}
				<div class="max-h-96 overflow-auto rounded border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead class="w-12">
									<input
										type="checkbox"
										checked={isAllSelected}
										onchange={toggleAll}
										class="rounded"
									/>
								</TableHead>
								<TableHead>ID</TableHead>
								<TableHead>Nombre</TableHead>
								<TableHead>Descripción</TableHead>
								<TableHead>Path</TableHead>
								<TableHead>Icono</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each modules as module (module.id)}
								<TableRow>
									<TableCell>
										<input
											type="checkbox"
											checked={selectedModuleIds.includes(module.id!)}
											onchange={() => toggleModule(module.id!)}
											class="rounded"
										/>
									</TableCell>
									<TableCell class="font-medium">{module.id}</TableCell>
									<TableCell>{module.name}</TableCell>
									<TableCell>{module.description || "-"}</TableCell>
									<TableCell class="font-mono text-sm">{module.path}</TableCell>
									<TableCell>{module.icon}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				</div>
			{/if}
		</div>

		<DialogFooter class="gap-2">
			<Button type="button" variant="outline" onclick={handleClose}>Cancelar</Button>
			<Button
				type="button"
				disabled={$updateMutation.isPending || !hasChanges}
				onclick={handleSubmit}
			>
				{#if $updateMutation.isPending}
					Guardando...
				{:else}
					Guardar cambios
				{/if}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
