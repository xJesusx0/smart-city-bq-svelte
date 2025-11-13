export const TOKEN_KEY = "jwt_token";
export const BASE_URL = import.meta.env.VITE_API_URL || "/api-py";
export const GEO_BASE_URL = import.meta.env.VITE_GEO_API_URL || "http://127.0.0.1:3000";
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
export const ISPROD = process.env.NODE_ENV === "production";
