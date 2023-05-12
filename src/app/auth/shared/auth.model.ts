export const AUTH_DATA = 'photoflux-auth-data';
export const USER_DATA = 'photoflux-user-data';
export const TIMEOUT_FACTOR = 0.75;

export interface Login {
  email: string;
  password: string;
}

export interface Register {
  name: string;
  email: string;
  password: string;
}

export interface Logout {
  refresh_token: string;
}

export interface UserData {
  // claims
  user: {
    exp: number;
    sub: string;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
    storedAt: number;
  };
}

export interface AuthData {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  data: AuthData;
}

export interface JSONResponse {
  data: any;
}
