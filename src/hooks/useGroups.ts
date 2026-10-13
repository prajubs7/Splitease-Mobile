import { useMemo } from 'react';

export const useGroups = () =>
  useMemo(
    () => ({
      groups: [],
      loading: false,
      refresh: async () => undefined,
    }),
    [],
  );
