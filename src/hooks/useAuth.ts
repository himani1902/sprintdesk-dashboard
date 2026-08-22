import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { authApi } from '../api/auth.api';
import { LoginCredentials } from '../types/auth';

export function useAuth() {
  const { user, accessToken, isAuthenticated, isLoading, error, setAuth, logout, setLoading } =
    useAuthStore();

  // Validate session on initial application mount
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const session = await authApi.refreshSession();
        if (isMounted) {
          if (session) {
            setAuth(session.user, session.accessToken);
          } else {
            setLoading(false);
          }
        }
      } catch {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const res = await authApi.login(credentials);
      setAuth(res.user, res.accessToken);
      return res;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}
