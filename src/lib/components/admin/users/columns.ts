import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import { renderComponent, renderSnippet } from "$lib/components/ui/data-table/index.js";
import type { components } from "$lib/__gen__/api_v1";
import DataTableActions from "./data-table-actions.svelte";
import DataTableIdButton from "./data-table-id-button.svelte";
import DataTableNameButton from "./data-table-name-button.svelte";
import DataTableEmailButton from "./data-table-email-button.svelte";
import DataTableDateButton from "./data-table-date-button.svelte";

type UserWithRoles = components["schemas"]["UserWithRolesDTO"];

export function createColumns(handlers: {
	onEdit?: (user: UserWithRoles) => void;
	onDelete?: (user: UserWithRoles) => void;
	onActivate?: (user: UserWithRoles) => void;
	activatingUserId?: number | null;
}): ColumnDef<UserWithRoles>[] {
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
			accessorKey: "email",
			header: ({ column }) =>
				renderComponent(DataTableEmailButton, {
					onclick: column.getToggleSortingHandler()
				}),
			cell: ({ row }) => {
				const emailCellSnippet = createRawSnippet<[{ email: string }]>((getEmail) => {
					const { email } = getEmail();
					return {
						render: () => `<div class="lowercase">${email}</div>`
					};
				});
				return renderSnippet(emailCellSnippet, {
					email: row.original.email
				});
			}
		},
		{
			accessorKey: "identification",
			header: () => {
				const identificationHeaderSnippet = createRawSnippet(() => {
					return {
						render: () => `<div>Identificación</div>`
					};
				});
				return renderSnippet(identificationHeaderSnippet);
			},
			cell: ({ row }) => {
				const identificationCellSnippet = createRawSnippet<[{ identification: string }]>(
					(getIdentification) => {
						const { identification } = getIdentification();
						return {
							render: () => `<div>${identification}</div>`
						};
					}
				);
				return renderSnippet(identificationCellSnippet, {
					identification: row.original.identification
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
					user: row.original,
					onEdit: handlers.onEdit,
					onDelete: handlers.onDelete,
					onActivate: handlers.onActivate,
					activatingUserId: handlers.activatingUserId
				})
		}
	];
}
