import { create } from 'zustand';
import { AuthState, User } from '../types/auth';
import { authApi } from '../api/auth.api';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setAuth: (user: User, accessToken: string, _refreshToken?: string) => {
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  setAccessToken: (token: string) => {
    set({ accessToken: token });
  },

  logout: () => {
    authApi.logout();
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
