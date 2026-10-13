import { useMemo } from 'react';

export type AuthState = {
  isAuthenticated: boolean;
  user: { id: string; email: string; fullName: string } | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuth = (): AuthState => {
  return useMemo(
    () => ({
      isAuthenticated: false,
      user: null,
      signIn: async () => undefined,
      signOut: async () => undefined,
    }),
    [],
  );
};
