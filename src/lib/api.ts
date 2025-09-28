import ky from "ky";
import createClient from "openapi-fetch";
import type { paths } from "$lib/__gen__/api_v1";
import { getToken } from "$lib/utils/token";
import { BASE_URL } from "./const";

export const client = ky.create({
	hooks: {
		beforeRequest: [
			(request) => {
				const token = getToken();
				if (token) {
					request.headers.set("Authorization", `Bearer ${token}`);
				}
			}
		]
	}
});

export const apiV1 = createClient<paths>({ baseUrl: BASE_URL, fetch: client });
