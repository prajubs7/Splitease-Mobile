export type CreateExpensePayload = {
  amount: string;
  description: string;
  paidBy: string;
  splitType: 'EQUAL' | 'EXACT';
  participantIds?: string[];
  exactShares?: Array<{ userId: string; amount: string }>;
};

export const fetchExpenses = async (_groupId: string) => [];

export const fetchExpenseById = async (_groupId: string, _expenseId: string) => ({
  id: _expenseId,
  description: 'Sample expense',
  amount: '100.00',
  paidBy: 'demo-user-id',
  splitType: 'EQUAL',
  createdAt: new Date().toISOString(),
  participants: [{ userId: 'demo-user-id', amount: '100.00' }],
});

export const createExpense = async (_groupId: string, payload: CreateExpensePayload) => ({
  id: 'demo-expense-id',
  description: payload.description,
  amount: payload.amount,
  paidBy: payload.paidBy,
  splitType: payload.splitType,
  createdAt: new Date().toISOString(),
  participants: payload.participantIds?.map((userId) => ({ userId, amount: payload.amount })) ?? [],
});
