export interface User {
  id: string | number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  token?: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  username: string;
  password?: string;
  expiresInMins?: number;
  rememberMe?: boolean;
}

export interface TokenResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  clearError: () => void;
  setLoading: (isLoading: boolean) => void;
}
