import { storage } from '../utils/storage';

export const REFRESH_TOKEN_KEY = 'sp_refresh_token';

interface PendingRequest {
  resolve: (value: Response) => void;
  reject: (reason?: unknown) => void;
  url: string;
  options: RequestInit;
}

let isRefreshing = false;
let failedQueue: PendingRequest[] = [];
let inMemoryAccessToken: string | null = null;

export const setAccessTokenInMemory = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getAccessTokenInMemory = () => {
  return inMemoryAccessToken;
};

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      const headers = new Headers(prom.options.headers || {});
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      fetch(prom.url, { ...prom.options, headers })
        .then(prom.resolve)
        .catch(prom.reject);
    }
  });
  failedQueue = [];
};

export async function apiClient(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {});
  
  if (inMemoryAccessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${inMemoryAccessToken}`);
  }
  
  if (!headers.has('Content-Type') && options.method && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  const updatedOptions = { ...options, headers };
  
  try {
    let response = await fetch(url, updatedOptions);

    // If 401 Unauthorized and not already refreshing auth itself
    if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, url, options: updatedOptions });
        });
      }

      isRefreshing = true;
      const refreshToken = storage.getItem<string | null>(REFRESH_TOKEN_KEY, null);

      if (!refreshToken) {
        isRefreshing = false;
        inMemoryAccessToken = null;
        return response;
      }

      try {
        const refreshResponse = await fetch('https://dummyjson.com/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refreshToken: refreshToken,
            expiresInMins: 30,
          }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          const newAccessToken = data.accessToken;
          const newRefreshToken = data.refreshToken || refreshToken;

          setAccessTokenInMemory(newAccessToken);
          storage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

          // Notify queued requests
          processQueue(null, newAccessToken);
          isRefreshing = false;

          // Retry the original request
          headers.set('Authorization', `Bearer ${newAccessToken}`);
          response = await fetch(url, { ...updatedOptions, headers });
          return response;
        } else {
          // Refresh token invalid or expired
          processQueue(new Error('Refresh token expired'), null);
          storage.removeItem(REFRESH_TOKEN_KEY);
          setAccessTokenInMemory(null);
          isRefreshing = false;
          return response;
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        storage.removeItem(REFRESH_TOKEN_KEY);
        setAccessTokenInMemory(null);
        isRefreshing = false;
        throw refreshErr;
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
}
