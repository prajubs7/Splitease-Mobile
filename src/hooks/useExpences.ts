import { useMemo } from 'react';

export const useExpences = () =>
  useMemo(
    () => ({
      expenses: [],
      loading: false,
      refresh: async () => undefined,
    }),
    [],
  );
