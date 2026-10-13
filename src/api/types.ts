export type UUID = string;
export type MoneyString = string;

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type UserResponse = {
  id: UUID;
  email: string;
  fullName: string;
  createdAt: string;
};

export type AuthTokens = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

export type GroupResponse = {
  id: UUID;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type MemberResponse = {
  id: UUID;
  userId: UUID;
  groupId: UUID;
  email: string;
  fullName: string;
  joinedAt: string;
};

export type CreateExpenseRequest = {
  amount: MoneyString;
  description: string;
  paidBy: UUID;
  splitType: 'EQUAL' | 'EXACT';
  participantIds?: UUID[];
  exactShares?: Array<{ userId: UUID; amount: MoneyString }>;
};

export type ExpenseSummaryResponse = {
  id: UUID;
  description: string;
  amount: MoneyString;
  paidBy: UUID;
  createdAt: string;
};

export type ExpenseResponse = {
  id: UUID;
  description: string;
  amount: MoneyString;
  paidBy: UUID;
  splitType: 'EQUAL' | 'EXACT';
  createdAt: string;
  participants: Array<{
    userId: UUID;
    amount: MoneyString;
  }>;
};

export type GroupBalancesResponse = {
  groupId: UUID;
  userBalances: Array<{
    userId: UUID;
    netCents: number;
  }>;
  transfers: Array<{
    fromUserId: UUID;
    toUserId: UUID;
    amount: MoneyString;
  }>;
};

export type SettlementResponse = {
  id: UUID;
  groupId: UUID;
  fromUserId: UUID;
  toUserId: UUID;
  amount: MoneyString;
  createdAt: string;
};
