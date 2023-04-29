export const AUTH_DATA = 'photoflux-auth-data';
export const USER_DATA = 'photoflux-user-data';
export const TIMEOUT_FACTOR = 0.75;

export interface Login {
  email: string;
  password: string;
}

export interface UserData {
  user?: {};
  tokens?: {
    access_token: string;
    refresh_token: string;
    storedAt: number;
  };
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface JSONResponse {
  data: any;
}
