import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { login as loginRequest } from '../../features/auth/api';
import type { LoginRequest } from '../../features/auth/types';
import { STORAGE_KEYS } from '../../constants/storage';

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
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

type Props = { children: ReactNode };

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(() => readStoredToken());

  const login = useCallback(async (payload: LoginRequest) => {
    const res = await loginRequest(payload);
    const expiresAt = Date.now() + res.expires_in * 1000;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.access_token);
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, String(expiresAt));
    setToken(res.access_token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
