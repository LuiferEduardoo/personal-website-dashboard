import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { login as loginRequest } from '../../features/auth/api';
import type { LoginRequest } from '../../features/auth/types';
import { getMe } from '../../features/user/api';
import type { UserRead } from '../../features/user/types';
import { ApiError } from '../../lib/api';
import { STORAGE_KEYS } from '../../constants/storage';

type AuthContextValue = {
  token: string | null;
  user: UserRead | null;
  isAuthenticated: boolean;
  userLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredToken(): string | null {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const expiresAtRaw = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
  if (!token || !expiresAtRaw) return null;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || Date.now() >= expiresAt) {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
    return null;
  }
  return token;
}

function clearStoredToken() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
}

type Props = { children: ReactNode };

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(() => readStoredToken());
  const [user, setUser] = useState<UserRead | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(() => Boolean(readStoredToken()));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setUserLoading(false);
      return;
    }

    let cancelled = false;
    setUserLoading(true);

    getMe(token)
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setUserLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setUserLoading(false);
        if (err instanceof ApiError && err.status === 401) {
          clearStoredToken();
          setToken(null);
          setUser(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async (payload: LoginRequest) => {
    const res = await loginRequest(payload);
    const expiresAt = Date.now() + res.expires_in * 1000;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.access_token);
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, String(expiresAt));
    setToken(res.access_token);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      userLoading,
      login,
      logout,
    }),
    [token, user, userLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
