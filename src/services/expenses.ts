import { apiClient } from '@/api/client';
import type {
  CreateExpenseRequest,
  ExpenseResponse,
  ExpenseSummaryResponse,
  Page,
} from '@/api/types';

export const fetchExpenses = async (
  groupId: string,
  page: number,
  size = 20,
): Promise<Page<ExpenseSummaryResponse>> =>
  (
    await apiClient.get<Page<ExpenseSummaryResponse>>(
      `/api/v1/groups/${groupId}/expenses`,
      { params: { page, size } },
    )
  ).data;

export const fetchExpenseById = async (
  groupId: string,
  expenseId: string,
): Promise<ExpenseResponse> =>
  (
    await apiClient.get<ExpenseResponse>(
      `/api/v1/groups/${groupId}/expenses/${expenseId}`,
    )
  ).data;

export const createExpense = async (
  groupId: string,
  payload: CreateExpenseRequest,
): Promise<ExpenseResponse> =>
  (
    await apiClient.post<ExpenseResponse>(
      `/api/v1/groups/${groupId}/expenses`,
      payload,
    )
  ).data;
