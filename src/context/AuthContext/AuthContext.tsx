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
import { setUnauthorizedHandler } from '../../lib/api';
import { STORAGE_KEYS } from '../../constants/storage';

type Session = { token: string; expiresAt: number };

type AuthContextValue = {
  token: string | null;
  user: UserRead | null;
  isAuthenticated: boolean;
  userLoading: boolean;
  sessionExpired: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: UserRead) => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

function clearStoredToken() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
}

function readStoredSession(): Session | null {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const expiresAtRaw = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
  if (!token || !expiresAtRaw) return null;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || Date.now() >= expiresAt) {
    clearStoredToken();
    return null;
  }
  return { token, expiresAt };
}

type Props = { children: ReactNode };

export function AuthProvider({ children }: Props) {
  const [session, setSession] = useState<Session | null>(() => readStoredSession());
  const [user, setUser] = useState<UserRead | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(() =>
    Boolean(readStoredSession()),
  );
  const [sessionExpired, setSessionExpired] = useState(false);

  const token = session?.token ?? null;

  const handleExpiration = useCallback(() => {
    clearStoredToken();
    setSession(null);
    setUser(null);
    setSessionExpired(true);
  }, []);

  useEffect(() => {
    if (!token) {
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
      .catch(() => {
        if (!cancelled) setUserLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!session) return;
    const ms = session.expiresAt - Date.now();
    if (ms <= 0) {
      handleExpiration();
      return;
    }
    const timeout = window.setTimeout(handleExpiration, ms);
    return () => window.clearTimeout(timeout);
  }, [session, handleExpiration]);

  useEffect(() => {
    setUnauthorizedHandler(handleExpiration);
    return () => setUnauthorizedHandler(null);
  }, [handleExpiration]);

  const login = useCallback(async (payload: LoginRequest) => {
    const res = await loginRequest(payload);
    const expiresAt = Date.now() + res.expires_in * 1000;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.access_token);
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, String(expiresAt));
    setSession({ token: res.access_token, expiresAt });
    setSessionExpired(false);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setSession(null);
    setUser(null);
    setSessionExpired(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      userLoading,
      sessionExpired,
      login,
      logout,
      updateUser: setUser,
    }),
    [token, user, userLoading, sessionExpired, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
