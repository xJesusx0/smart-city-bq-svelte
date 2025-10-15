<script lang="ts">
	import type { components } from "$lib/__gen__/api_v1";
	import { Avatar, AvatarFallback } from "$lib/components/ui/avatar";
	import { Button } from "$lib/components/ui/button";
	import {
		Sheet,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from "$lib/components/ui/sheet";
	import { logout } from "$lib/query/auth";
	import { getModuleIcon } from "$lib/utils/module-icons";
	import { Building2, LogOut, Menu } from "@lucide/svelte";
	import type { LayoutData } from "../../../routes/(app)/$types";
	import { onMount } from "svelte";
	import { getUserInitials } from "$lib/utils/nameHelper";

	let { data }: { data: LayoutData } = $props();

	// Obtener módulos con tipo correcto
	const allowedModules = $derived(
		(data.user?.modules || []) as components["schemas"]["ModuleBase"][]
	);

	let isOpen = $state(false);

	onMount(() => {
		const mediaQuery = window.matchMedia("(min-width: 768px)");

		const handleMediaChange = (e: MediaQueryListEvent) => {
			if (e.matches && isOpen) {
				isOpen = false;
			}
		};
		mediaQuery.addEventListener("change", handleMediaChange);
		return () => {
			mediaQuery.removeEventListener("change", handleMediaChange);
		};
	});
</script>

<div class="flex items-center justify-between border-b p-4 md:hidden">
	<div class="flex items-center gap-2">
		<div
			class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
		>
			<Building2 class="h-4 w-4" />
		</div>
		<h1 class="text-lg font-semibold">Smart City</h1>
	</div>

	<Sheet bind:open={isOpen}>
		<SheetTrigger>
			<Button variant="ghost" size="icon">
				<Menu class="h-5 w-5" />
				<span class="sr-only">Abrir menú</span>
			</Button>
		</SheetTrigger>
		<SheetContent side="left" class="max-w-80 p-0">
			<SheetHeader class="p-6 pb-0">
				<SheetTitle class="flex items-center gap-2">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
					>
						<Building2 class="h-4 w-4" />
					</div>
					Smart City
				</SheetTitle>
			</SheetHeader>

			<div class="flex h-full flex-col">
				<!-- Navegación de módulos -->
				<div class="flex-1 p-6">
					<nav class="space-y-2">
						{#each allowedModules as module (module.id)}
							{@const IconComponent = getModuleIcon(module.icon)}
							<a
								href={module.path}
								class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
							>
								<IconComponent class="h-4 w-4" />
								{module.name}
							</a>
						{/each}
					</nav>
				</div>

				<!-- Información del usuario -->
				{#if data.user}
					<div class="border-t p-6">
						<div class="flex items-center gap-3">
							<Avatar class="h-8 w-8">
								<AvatarFallback class="text-xs">
									{getUserInitials(data.user.name)}
								</AvatarFallback>
							</Avatar>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-medium">{data.user.name}</p>
								<p class="truncate text-xs text-muted-foreground">{data.user.email}</p>
								{#if data.user.roles.length > 0}
									<p class="text-xs text-muted-foreground">
										{data.user.roles[0].name}
									</p>
								{/if}
							</div>
							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8"
								onclick={logout}
								title="Cerrar sesión"
							>
								<LogOut class="h-4 w-4" />
							</Button>
						</div>
					</div>
				{/if}
			</div>
		</SheetContent>
	</Sheet>
</div>
