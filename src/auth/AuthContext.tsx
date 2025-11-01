import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn as apiSignIn, me, logout as apiLogout } from '../api/auth';

type AuthUser = any;

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const TOKENS = { access: 'accessToken', refresh: 'refreshToken' } as const;

async function setTokens(access: string, refresh?: string) {
  const ops: [string, string][] = [[TOKENS.access, access]];
  if (refresh) ops.push([TOKENS.refresh, refresh]);
  await AsyncStorage.multiSet(ops);
}

async function clearTokens() {
  await AsyncStorage.multiRemove([TOKENS.access, TOKENS.refresh]);
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isSignedIn: false,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const entries = await AsyncStorage.multiGet([TOKENS.access, TOKENS.refresh]);
        const access = entries.find((x) => x[0] === TOKENS.access)?.[1];
        if (access) {
          try {
            const profile = await me();
            if (!cancelled) setUser(profile);
          } catch {
            await clearTokens();
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await apiSignIn({ email, password });
    if (!res?.accessToken) throw new Error('No access token in response');
    await setTokens(res.accessToken, res.refreshToken);
    const profile = await me();
    setUser(profile);
  }, []);

  const signOut = useCallback(async () => {
    try { await apiLogout(); } catch {}
    await clearTokens();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isSignedIn: !!user,
    signIn,
    signOut,
  }), [user, loading, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
