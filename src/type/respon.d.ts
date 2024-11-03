export interface ResponToken {
	token: string;
	expires: Date;
}

export interface ResponTokenAuth {
	access: ResponToken;
	refresh?: ResponToken;
}
