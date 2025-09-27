import ky from "ky";
import createClient from "openapi-fetch";
import type { paths } from "./__gen__/api_v1";

export const client = ky.create();
const baseUrl = import.meta.env.VITE_API_URL || "/api-py";
export const apiV1 = createClient<paths>({ baseUrl, fetch: client });
