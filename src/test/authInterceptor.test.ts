import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, setAccessTokenInMemory, getAccessTokenInMemory, REFRESH_TOKEN_KEY } from '../api/client';
import { storage } from '../utils/storage';

describe('Auth Interceptor & Silent Refresh Queue', () => {
  beforeEach(() => {
    localStorage.clear();
    setAccessTokenInMemory(null);
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should attach Bearer token to request headers if present in memory', async () => {
    setAccessTokenInMemory('test-access-token-123');

    const globalFetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
    vi.stubGlobal('fetch', globalFetchMock);

    await apiClient('https://api.example.com/data');

    expect(globalFetchMock).toHaveBeenCalledTimes(1);
    const [, options] = globalFetchMock.mock.calls[0];
    const headers = options.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer test-access-token-123');
  });

  it('should handle 401 response by triggering token refresh and retrying original request', async () => {
    setAccessTokenInMemory('expired-token');
    storage.setItem(REFRESH_TOKEN_KEY, 'valid-refresh-token');

    let fetchCount = 0;
    const globalFetchMock = vi.fn().mockImplementation((url: string) => {
      fetchCount++;
      // First call fails with 401
      if (fetchCount === 1) {
        return Promise.resolve(new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }));
      }
      // Second call is the refresh call
      if (url.includes('/auth/refresh')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({ accessToken: 'new-fresh-access-token', refreshToken: 'new-refresh-token' }),
            { status: 200 }
          )
        );
      }
      // Third call is the retried original request with new token
      return Promise.resolve(new Response(JSON.stringify({ data: 'Protected Data' }), { status: 200 }));
    });

    vi.stubGlobal('fetch', globalFetchMock);

    const response = await apiClient('https://api.example.com/protected-resource');
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.data).toBe('Protected Data');
    expect(getAccessTokenInMemory()).toBe('new-fresh-access-token');
    expect(storage.getItem(REFRESH_TOKEN_KEY, null)).toBe('new-refresh-token');
  });

  it('should clear session if refresh token call fails', async () => {
    setAccessTokenInMemory('expired-token');
    storage.setItem(REFRESH_TOKEN_KEY, 'invalid-refresh-token');

    const globalFetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/auth/refresh')) {
        return Promise.resolve(new Response(JSON.stringify({ error: 'Refresh token expired' }), { status: 400 }));
      }
      return Promise.resolve(new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }));
    });

    vi.stubGlobal('fetch', globalFetchMock);

    const response = await apiClient('https://api.example.com/protected');
    expect(response.status).toBe(401);
    expect(getAccessTokenInMemory()).toBeNull();
    expect(storage.getItem(REFRESH_TOKEN_KEY, null)).toBeNull();
  });
});
