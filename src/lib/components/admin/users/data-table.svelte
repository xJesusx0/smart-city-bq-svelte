<script lang="ts">
	import {
		type PaginationState,
		type SortingState,
		type ColumnFiltersState,
		type VisibilityState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from "@tanstack/table-core";
	import { FlexRender, createSvelteTable } from "$lib/components/ui/data-table/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "@lucide/svelte";
	import { createColumns } from "./columns";
	import type { components } from "$lib/__gen__/api_v1";

	type UserWithRoles = components["schemas"]["UserWithRolesDTO"];

	let {
		data,
		onEdit,
		onDelete,
		onActivate,
		activatingUserId
	}: {
		data: UserWithRoles[];
		onEdit?: (user: UserWithRoles) => void;
		onDelete?: (user: UserWithRoles) => void;
		onActivate?: (user: UserWithRoles) => void;
		activatingUserId?: number | null;
	} = $props();

	const columns = createColumns({
		onEdit,
		onDelete,
		onActivate,
		activatingUserId
	});

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === "function") {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === "function") {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === "function") {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === "function") {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			}
		}
	});
</script>

<div>
	<div class="flex items-center gap-x-2 py-4">
		<Input
			placeholder="Filtrar por email..."
			value={table.getColumn("email")?.getFilterValue() as string}
			onchange={(e) => table.getColumn("email")?.setFilterValue(e.currentTarget.value)}
			oninput={(e) => table.getColumn("email")?.setFilterValue(e.currentTarget.value)}
			class="max-w-sm"
		/>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" class="ml-auto">Columnas</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
					<DropdownMenu.CheckboxItem
						class="capitalize"
						checked={column.getIsVisible()}
						onCheckedChange={(v) => column.toggleVisibility(!!v)}
					>
						{column.id}
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#if table.getRowModel().rows?.length}
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row data-state={row.getIsSelected() && "selected"}>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell>
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">
							No hay resultados.
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="flex items-center justify-end py-4">
		<div class="flex flex-col items-center gap-x-6 max-sm:gap-y-4 sm:flex-row lg:gap-x-8">
			<div class="flex items-center gap-x-2">
				<p class="text-sm font-medium">Filas por página</p>
				<select
					value={table.getState().pagination.pageSize}
					onchange={(e) => {
						table.setPageSize(Number(e.currentTarget.value));
					}}
					class="h-8 rounded border border-input bg-background px-3 py-1 text-sm"
				>
					{#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
						<option value={pageSize}>{pageSize}</option>
					{/each}
				</select>
			</div>
			<div class="flex gap-x-2">
				<div class="flex w-full max-w-28 items-center justify-center text-sm font-medium">
					Página {table.getState().pagination.pageIndex + 1} de
					{table.getPageCount()}
				</div>
				<div class="flex items-center gap-x-2">
					<Button
						variant="outline"
						class="hidden h-8 w-8 p-0 lg:flex"
						onclick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span class="sr-only">Ir a la primera página</span>
						<ChevronsLeft class="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						class="h-8 w-8 p-0"
						onclick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span class="sr-only">Ir a la página anterior</span>
						<ChevronLeft class="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						class="h-8 w-8 p-0"
						onclick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span class="sr-only">Ir a la página siguiente</span>
						<ChevronRight class="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						class="hidden h-8 w-8 p-0 lg:flex"
						onclick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span class="sr-only">Ir a la última página</span>
						<ChevronsRight class="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>
