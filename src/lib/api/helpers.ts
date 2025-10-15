import { browser } from "$app/environment";
import Cookies from "universal-cookie";
import { ISPROD } from "./const";

const cookies = new Cookies();

interface CookieOptions {
	maxAge?: number;
	expires?: Date;
	path?: string;
	domain?: string;
	secure?: boolean;
	sameSite?: "strict" | "lax" | "none";
}

export const setCookie = (name: string, value: string, options?: CookieOptions) => {
	if (browser) {
		cookies.set(name, value, {
			path: "/",
			sameSite: "strict",
			secure: ISPROD,
			...options
		});
	}
};

export const getCookie = (name: string) => {
	if (browser) {
		return cookies.get(name);
	}
	return null;
};

export const deleteCookie = (name: string) => {
	if (browser) {
		cookies.remove(name, { path: "/" });
	}
};
