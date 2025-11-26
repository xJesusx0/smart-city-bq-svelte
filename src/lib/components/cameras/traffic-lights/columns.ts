import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import { renderComponent, renderSnippet } from "$lib/components/ui/data-table/index.js";
import type { components } from "$lib/__gen__/api_v1";
import DataTableIdButton from "../data-table-id-button.svelte";
import DataTableNameButton from "../data-table-name-button.svelte";
import DataTableDateButton from "../data-table-date-button.svelte";
import DataTableActions from "../data-table-actions.svelte";

type TrafficLight = components["schemas"]["TrafficLight"];

export function createColumns(handlers: {
	onViewDetails?: (trafficLight: TrafficLight) => void;
}): ColumnDef<TrafficLight>[] {
	return [
		{
			accessorKey: "id",
			header: ({ column }) =>
				renderComponent(DataTableIdButton, {
					onclick: column.getToggleSortingHandler()
				}),
			cell: ({ row }) => {
				const idCellSnippet = createRawSnippet<[{ id: number | null | undefined }]>((getId) => {
					const { id } = getId();
					return {
						render: () => `<div class="font-medium">${id ?? "N/A"}</div>`
					};
				});
				return renderSnippet(idCellSnippet, {
					id: row.original.id
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
				const nameCellSnippet = createRawSnippet<[{ name: string | null | undefined }]>(
					(getName) => {
						const { name } = getName();
						return {
							render: () => `<div>${name || "Sin nombre"}</div>`
						};
					}
				);
				return renderSnippet(nameCellSnippet, {
					name: row.original.name
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
				const statusCellSnippet = createRawSnippet<[{ active: boolean | null | undefined }]>(
					(getStatus) => {
						const { active } = getStatus();
						const text = active ? "Activo" : "Inactivo";
						return {
							render: () =>
								`<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}">${text}</span>`
						};
					}
				);
				return renderSnippet(statusCellSnippet, {
					active: row.original.active
				});
			}
		},
		{
			accessorKey: "latitude",
			header: () => {
				const locationHeaderSnippet = createRawSnippet(() => {
					return {
						render: () => `<div>Ubicación</div>`
					};
				});
				return renderSnippet(locationHeaderSnippet);
			},
			cell: ({ row }) => {
				const locationCellSnippet = createRawSnippet<
					[{ lat: number | null | undefined; lng: number | null | undefined }]
				>((getLocation) => {
					const { lat, lng } = getLocation();
					if (lat !== null && lat !== undefined && lng !== null && lng !== undefined) {
						return {
							render: () =>
								`<div class="font-mono text-xs">${lat.toFixed(5)}, ${lng.toFixed(5)}</div>`
						};
					}
					return {
						render: () => `<div class="text-muted-foreground">N/A</div>`
					};
				});
				return renderSnippet(locationCellSnippet, {
					lat: row.original.latitude,
					lng: row.original.longitude
				});
			}
		},
		{
			accessorKey: "created_at",
			header: ({ column }) =>
				renderComponent(DataTableDateButton, {
					onclick: column.getToggleSortingHandler()
				}),
			cell: ({ row }) => {
				const dateCellSnippet = createRawSnippet<[{ date: string | null | undefined }]>(
					(getDate) => {
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
					}
				);
				return renderSnippet(dateCellSnippet, {
					date: row.original.created_at ?? undefined
				});
			}
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(DataTableActions, {
					trafficLight: row.original,
					onViewDetails: handlers.onViewDetails
				})
		}
	];
}
