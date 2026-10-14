import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { setUnauthorizedHandler } from '@/api/client';
import { tokenStore } from '@/api/tokenStore';
import type { RegisterRequest, UserResponse } from '@/api/types';
import * as authApi from '@/services/auth';
import { tokenStorage } from './tokenStorage';

type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

type AuthContextValue = {
  status: AuthStatus;
  user: UserResponse | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<UserResponse | null>(null);

  const endSession = useCallback(async () => {
    tokenStore.clear();
    await tokenStorage.clear();
    queryClient.clear();
    setUser(null);
    setStatus('signedOut');
  }, [queryClient]);

  // any 401 on an authenticated request logs the user out
  useEffect(() => {
    setUnauthorizedHandler(() => {
      endSession();
    });
    return () => setUnauthorizedHandler(null);
  }, [endSession]);

  // restore the session at launch
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await tokenStorage.load();
      if (!token) {
        if (!cancelled) {
          setStatus('signedOut');
        }
        return;
      }
      tokenStore.set(token);
      try {
        const me = await authApi.getCurrentUser();
        if (!cancelled) {
          setUser(me);
          setStatus('signedIn');
        }
      } catch {
        // a 401 is handled by the interceptor (it ends the session); on a network error keep
        // the stored token and fall back to the login screen
        tokenStore.clear();
        if (!cancelled) {
          setStatus('signedOut');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken } = await authApi.login({ email, password });
    tokenStore.set(accessToken);
    try {
      const me = await authApi.getCurrentUser();
      await tokenStorage.save(accessToken);
      setUser(me);
      setStatus('signedIn');
    } catch (e) {
      tokenStore.clear();
      throw e;
    }
  }, []);

  const register = useCallback(
    async (input: RegisterRequest) => {
      const res = await authApi.register(input);
      console.log("Register result ", res);
      const { accessToken } = await authApi.login({ email: input.email, password: input.password });
      tokenStore.set(accessToken);
      console.log("Login result ", { accessToken });
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === 'signedIn',
      login,
      register,
      logout: endSession,
    }),
    [status, user, login, register, endSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  console.log("useAuth called");
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthProvider;
