import { apiClient, setAccessTokenInMemory, REFRESH_TOKEN_KEY } from './client';
import { LoginCredentials, TokenResponse, RefreshResponse, User } from '../types/auth';
import { storage } from '../utils/storage';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
    const response = await apiClient('https://dummyjson.com/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password || 'emilyspass',
        expiresInMins: credentials.rememberMe ? 43200 : 60, // 30 days vs 1 hour
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({ message: 'Invalid credentials' }));
      throw new Error(errData.message || 'Login failed. Please check your credentials.');
    }

    const data: TokenResponse = await response.json();
    
    const user: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: 'https://i.pravatar.cc/150?img=47',
    };

    setAccessTokenInMemory(data.accessToken);
    storage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

    return {
      user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  },

  refreshSession: async (): Promise<{ user: User; accessToken: string; refreshToken: string } | null> => {
    const refreshToken = storage.getItem<string | null>(REFRESH_TOKEN_KEY, null);
    if (!refreshToken) return null;

    try {
      const response = await apiClient('https://dummyjson.com/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken,
          expiresInMins: 60,
        }),
      });

      if (!response.ok) {
        storage.removeItem(REFRESH_TOKEN_KEY);
        setAccessTokenInMemory(null);
        return null;
      }

      const data: RefreshResponse = await response.json();
      setAccessTokenInMemory(data.accessToken);
      storage.setItem(REFRESH_TOKEN_KEY, data.refreshToken || refreshToken);

      // Fetch user profile info or construct fallback user
      const userResponse = await apiClient('https://dummyjson.com/auth/me', {
        headers: { Authorization: `Bearer ${data.accessToken}` }
      });

      let user: User;
      if (userResponse.ok) {
        const userData = await userResponse.json();
        user = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          image: userData.image,
        };
      } else {
        user = {
          id: 1,
          username: 'emilys',
          email: 'emily.johnson@example.com',
          firstName: 'Emily',
          lastName: 'Johnson',
          image: 'https://i.pravatar.cc/150?img=47',
        };
      }

      return {
        user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || refreshToken,
      };
    } catch {
      storage.removeItem(REFRESH_TOKEN_KEY);
      setAccessTokenInMemory(null);
      return null;
    }
  },

  logout: () => {
    storage.removeItem(REFRESH_TOKEN_KEY);
    setAccessTokenInMemory(null);
  }
};
