import { House, ChartColumnIncreasing, ShieldUser, Dot, Settings } from "@lucide/svelte";

// Mapa de iconos disponibles para módulos
export const MODULE_ICONS = {
	House,
	ChartColumnIncreasing,
	ShieldUser,
	Settings,
	Dot // Icono por defecto
} as const;

// Función para obtener el componente de icono según el nombre
export function getModuleIcon(iconName: string) {
	const IconComponent = MODULE_ICONS[iconName as keyof typeof MODULE_ICONS];
	return IconComponent || MODULE_ICONS.Dot;
}

// Función para verificar si un icono existe
export function hasModuleIcon(iconName: string): boolean {
	return iconName in MODULE_ICONS;
}
