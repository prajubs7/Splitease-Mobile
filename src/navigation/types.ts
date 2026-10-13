export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AppTabs: undefined;
  GroupDetail: { groupId: string };
  ExpenseDetail: { groupId: string; expenseId: string };
  AddExpense: { groupId: string };
  SettleUp: { groupId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
