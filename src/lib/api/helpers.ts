import { browser } from '$app/environment';

// Funciones simples para manejar cookies usando APIs nativas del navegador
export const setCookie = (name: string, value: string) => {
	if (browser) {
		document.cookie = `${name}=${value};path=/;SameSite=Strict`;
	}
};

export const getCookie = (name: string) => {
	if (browser) {
		return document.cookie
			.split('; ')
			.find(row => row.startsWith(name + '='))
			?.split('=')[1];
	}
	return null;
};

export const deleteCookie = (name: string) => {
	if (browser) {
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
	}
};
