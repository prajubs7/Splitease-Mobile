export const queryKeys = {
  auth: ['auth'] as const,
  groups: ['groups'] as const,
  group: (groupId: string) => ['groups', groupId] as const,
  groupMembers: (groupId: string) => ['groups', groupId, 'members'] as const,
  groupExpenses: (groupId: string) => ['groups', groupId, 'expenses'] as const,
  groupBalances: (groupId: string) => ['groups', groupId, 'balances'] as const,
  groupSettlements: (groupId: string) => ['groups', groupId, 'settlements'] as const,
  expense: (groupId: string, expenseId: string) => ['groups', groupId, 'expenses', expenseId] as const,
};
