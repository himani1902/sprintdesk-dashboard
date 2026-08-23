import { create } from 'zustand';
import { AuthState, User } from '../types/auth';
import { authApi } from '../api/auth.api';
import { storage } from '../utils/storage';
import { setAccessTokenInMemory, REFRESH_TOKEN_KEY } from '../api/client';

const USER_STORAGE_KEY = 'sp_user';
const TOKEN_STORAGE_KEY = 'sp_token';

const sanitizeAvatar = (img?: string) => {
  if (!img || img.includes('dummyjson.com/icon')) {
    return 'https://i.pravatar.cc/150?img=47';
  }
  return img;
};

const rawUser = storage.getItem<User | null>(USER_STORAGE_KEY, null);
const initialUser = rawUser
  ? {
      ...rawUser,
      image: sanitizeAvatar(rawUser.image),
    }
  : null;
const initialToken = storage.getItem<string | null>(TOKEN_STORAGE_KEY, null);

if (initialToken) {
  setAccessTokenInMemory(initialToken);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  accessToken: initialToken,
  isAuthenticated: Boolean(initialUser && initialToken),
  isLoading: false,
  error: null,

  setAuth: (user: User, accessToken: string, _refreshToken?: string) => {
    const sanitizedUser = {
      ...user,
      image: sanitizeAvatar(user.image),
    };
    storage.setItem(USER_STORAGE_KEY, sanitizedUser);
    storage.setItem(TOKEN_STORAGE_KEY, accessToken);
    setAccessTokenInMemory(accessToken);
    set({
      user: sanitizedUser,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  setAccessToken: (token: string) => {
    storage.setItem(TOKEN_STORAGE_KEY, token);
    setAccessTokenInMemory(token);
    set({ accessToken: token });
  },

  logout: () => {
    authApi.logout();
    storage.removeItem(USER_STORAGE_KEY);
    storage.removeItem(TOKEN_STORAGE_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
    setAccessTokenInMemory(null);
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
