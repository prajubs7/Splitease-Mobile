export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabsParamList = {
  Groups: undefined;
  Account: undefined;
};

// Screens shown only when signed in
export type AppStackParamList = {
  AppTabs: undefined;
  CreateGroup: undefined;
  GroupDetail: { groupId: string };
  ExpenseDetail: { groupId: string; expenseId: string };
  AddExpense: { groupId: string };
  SettleUp: { groupId: string };
};
