import { useMemo } from 'react';

export const useBalances = () =>
  useMemo(
    () => ({
      balances: [],
      loading: false,
      refresh: async () => undefined,
    }),
    [],
  );
