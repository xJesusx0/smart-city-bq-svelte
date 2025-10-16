<script lang="ts">
	import type { components } from "$lib/__gen__/api_v1";
	import { Avatar, AvatarFallback } from "$lib/components/ui/avatar";
	import { Button } from "$lib/components/ui/button";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import {
		Sidebar,
		SidebarContent,
		SidebarFooter,
		SidebarGroup,
		SidebarGroupContent,
		SidebarHeader,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		SidebarTrigger
	} from "$lib/components/ui/sidebar";
	import { logout } from "$lib/query/auth";
	import { getModuleIcon } from "$lib/utils/module-icons";
	import { Building2, LogOut } from "@lucide/svelte";
	import { getUserInitials } from "$lib/utils/nameHelper";
	import type { LayoutData } from "../../../routes/(app)/$types";

	let { data }: { data: LayoutData } = $props();

	// Obtener módulos con tipo correcto
	const allowedModules = $derived(
		(data.user?.modules || []) as components["schemas"]["ModuleBase"][]
	);
</script>

<Sidebar variant="inset" collapsible="icon" class="border-r">
	<SidebarHeader>
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" class="w-full">
					<div
						class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-data-[collapsible=icon]:hidden"
					>
						<Building2 class="size-4" />
					</div>
					<div
						class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden"
					>
						<span class="truncate font-semibold">Smart City</span>
					</div>
					<SidebarTrigger class="ml-auto " />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarHeader>

	<Separator />

	<SidebarContent>
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{#each allowedModules as module (module.id)}
						{@const IconComponent = getModuleIcon(module.icon)}
						<SidebarMenuItem>
							<SidebarMenuButton tooltipContent={module.name} class="h-8 p-0">
								<a
									href={module.path}
									class="flex h-full w-full items-center justify-start gap-2 p-2"
								>
									<IconComponent class="size-4" />
									<span class="group-data-[collapsible=icon]:hidden">{module.name}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					{/each}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	</SidebarContent>

	<SidebarFooter>
		<SidebarMenu>
			<SidebarMenuItem>
				{#if data.user}
					<SidebarMenuButton size="lg" class="w-full">
						<Avatar class="size-8 rounded-lg">
							<AvatarFallback class="rounded-lg">
								{getUserInitials(data.user.name)}
							</AvatarFallback>
						</Avatar>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">{data.user.name}</span>
							<span class="truncate text-xs text-muted-foreground">{data.user.email}</span>
						</div>
						<Button
							variant="ghost"
							size="icon"
							class="size-8 group-data-[collapsible=icon]:hidden"
							onclick={logout}
							title="Cerrar sesión"
						>
							<LogOut class="size-4" />
						</Button>
					</SidebarMenuButton>
				{/if}
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>
</Sidebar>
