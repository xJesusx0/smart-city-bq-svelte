export interface User {
	email: string;
	name: string;
	picture: string;
	google_id: string;
	email_verified: boolean;
}

export interface TokenResponse {
	access_token: string;
	token_type: string;
	user: User;
}

export interface CredentialResponse {
	clientId: string;
	credential: string;
	select_by?: string;
}

// Tipos para la API de Google Sign-In
export interface GoogleAccounts {
	id: {
		initialize: (config: GoogleInitConfig) => void;
		renderButton: (element: HTMLElement, config: GoogleButtonConfig) => void;
		disableAutoSelect: () => void;
		prompt: () => void;
	};
}

export interface GoogleInitConfig {
	client_id: string;
	callback: (response: CredentialResponse) => void;
	auto_select?: boolean;
	cancel_on_tap_outside?: boolean;
}

export interface GoogleButtonConfig {
	theme?: "outline" | "filled_blue" | "filled_black";
	size?: "large" | "medium" | "small";
	text?: "signin_with" | "signup_with" | "continue_with" | "signin";
	shape?: "rectangular" | "pill" | "circle" | "square";
	logo_alignment?: "left" | "center";
	width?: number;
	locale?: string;
}

declare global {
	interface Window {
		google?: {
			accounts: GoogleAccounts;
		};
	}
}
