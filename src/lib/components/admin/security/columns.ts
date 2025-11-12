import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import { renderComponent, renderSnippet } from "$lib/components/ui/data-table/index.js";
import type { components } from "$lib/__gen__/api_v1";
import DataTableActions from "./data-table-actions.svelte";
import DataTableIdButton from "./data-table-id-button.svelte";
import DataTableNameButton from "./data-table-name-button.svelte";
import DataTableModulesButton from "./data-table-modules-button.svelte";
import DataTableDateButton from "./data-table-date-button.svelte";

type DbRole = components["schemas"]["RoleWithModulesDTO"];

export function createColumns(handlers: {
	onEdit?: (role: DbRole) => void;
	onModules?: (role: DbRole) => void;
	onDelete?: (role: DbRole) => void;
	onActivate?: (role: DbRole) => void;
	activatingRoleId?: number | null;
}): ColumnDef<DbRole>[] {
	return [
		{
			accessorKey: "id",
			header: ({ column }) =>
				renderComponent(DataTableIdButton, {
					onclick: column.getToggleSortingHandler()
				}),
			cell: ({ row }) => {
				const idCellSnippet = createRawSnippet<[{ id: number }]>((getId) => {
					const { id } = getId();
					return {
						render: () => `<div class="font-medium">${id}</div>`
					};
				});
				return renderSnippet(idCellSnippet, {
					id: row.original.id!
				});
			}
		},
		{
			accessorKey: "name",
			header: ({ column }) =>
				renderComponent(DataTableNameButton, {
					onclick: column.getToggleSortingHandler()
				}),
			cell: ({ row }) => {
				const nameCellSnippet = createRawSnippet<[{ name: string }]>((getName) => {
					const { name } = getName();
					return {
						render: () => `<div>${name}</div>`
					};
				});
				return renderSnippet(nameCellSnippet, {
					name: row.original.name
				});
			}
		},
		{
			accessorKey: "description",
			header: () => {
				const descriptionHeaderSnippet = createRawSnippet(() => {
					return {
						render: () => `<div>Descripción</div>`
					};
				});
				return renderSnippet(descriptionHeaderSnippet);
			},
			cell: ({ row }) => {
				const descriptionCellSnippet = createRawSnippet<
					[{ description: string | null | undefined }]
				>((getDescription) => {
					const { description } = getDescription();
					return {
						render: () => `<div>${description || "-"}</div>`
					};
				});
				return renderSnippet(descriptionCellSnippet, {
					description: row.original.description
				});
			}
		},
		{
			accessorKey: "active",
			header: () => {
				const statusHeaderSnippet = createRawSnippet(() => {
					return {
						render: () => `<div>Estado</div>`
					};
				});
				return renderSnippet(statusHeaderSnippet);
			},
			cell: ({ row }) => {
				const statusCellSnippet = createRawSnippet<[{ active: boolean }]>((getStatus) => {
					const { active } = getStatus();
					const text = active ? "Activo" : "Inactivo";
					return {
						render: () =>
							`<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}">${text}</span>`
					};
				});
				return renderSnippet(statusCellSnippet, {
					active: row.original.active
				});
			}
		},
		{
			accessorKey: "modules",
			header: ({ column }) =>
				renderComponent(DataTableModulesButton, {
					onclick: column.getToggleSortingHandler()
				}),
			cell: ({ row }) => {
				const modulesCellSnippet = createRawSnippet<[{ modules: unknown[] | null }]>(
					(getModules) => {
						const { modules } = getModules();
						const count = modules?.length ?? 0;
						return {
							render: () => `<div>${count}</div>`
						};
					}
				);
				return renderSnippet(modulesCellSnippet, {
					modules: row.original.modules
				});
			}
		},
		{
			accessorKey: "creation_date",
			header: ({ column }) =>
				renderComponent(DataTableDateButton, {
					onclick: column.getToggleSortingHandler()
				}),
			cell: ({ row }) => {
				const dateCellSnippet = createRawSnippet<[{ date: string | undefined }]>((getDate) => {
					const { date } = getDate();
					const formatted = date
						? new Date(date).toLocaleDateString("es-ES", {
								year: "numeric",
								month: "short",
								day: "numeric"
							})
						: "N/A";
					return {
						render: () => `<div>${formatted}</div>`
					};
				});
				return renderSnippet(dateCellSnippet, {
					date: row.original.creation_date
				});
			}
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(DataTableActions, {
					role: row.original,
					onEdit: handlers.onEdit,
					onModules: handlers.onModules,
					onDelete: handlers.onDelete,
					onActivate: handlers.onActivate,
					activatingRoleId: handlers.activatingRoleId
				})
		}
	];
}
