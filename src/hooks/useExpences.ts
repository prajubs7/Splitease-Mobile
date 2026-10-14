import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/keys';
import type { CreateExpenseRequest } from '@/api/types';
import * as expensesApi from '@/services/expenses';

const PAGE_SIZE = 20;

export const useExpenses = (groupId: string) =>
  useInfiniteQuery({
    queryKey: queryKeys.groupExpenses(groupId),
    queryFn: ({ pageParam }) => expensesApi.fetchExpenses(groupId, pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      const nextPage = lastPage.page.number + 1;
      return nextPage < lastPage.page.totalPages ? nextPage : undefined;
    },
    enabled: groupId.length > 0,
  });

export const useExpense = (groupId: string, expenseId: string) =>
  useQuery({
    queryKey: queryKeys.expense(groupId, expenseId),
    queryFn: () => expensesApi.fetchExpenseById(groupId, expenseId),
    enabled: groupId.length > 0 && expenseId.length > 0,
  });

export const useCreateExpense = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExpenseRequest) => expensesApi.createExpense(groupId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.groupExpenses(groupId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.groupBalances(groupId) }),
      ]);
    },
  });
};

export const useExpences = useExpenses;
