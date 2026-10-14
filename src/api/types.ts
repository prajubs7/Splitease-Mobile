// Mirrors ../splitease/src/main/java/com/splitease/splitease/dto/*.
// Responses: BigDecimal fields arrive as JSON numbers (e.g. 100.00 -> 100), Instants as ISO strings.
// Requests: send money as a "100.00" string so no precision is lost on the way out.

export type UUID = string;
export type ISODateString = string;
/** BigDecimal as received from the API (a JSON number). Convert with toCents() before doing math. */
export type MoneyAmount = number;
/** Money sent to the API, e.g. "100.00" (max 10 integer digits, 2 decimals). */
export type MoneyString = string;

export type GroupRole = 'OWNER' | 'MEMBER';
export type SplitType = 'EQUAL' | 'EXACT';

// Spring Data with serialization-mode: via_dto
export type Page<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

// --- auth / users ---
export type RegisterRequest = { email: string; password: string; fullName: string };
export type LoginRequest = { email: string; password: string };
export type TokenResponse = { accessToken: string; tokenType: string; expiresIn: number };
export type UserResponse = { id: UUID; email: string; fullName: string; createdAt: ISODateString };
export type HealthResponse = { status: string; service: string; timestamp: ISODateString };

// --- groups ---
export type CreateGroupRequest = { name: string };
export type AddMemberRequest = { email: string };
export type GroupResponse = {
  id: UUID;
  name: string;
  createdById: UUID;
  createdByName: string;
  myRole: GroupRole;
  createdAt: ISODateString;
};
export type MemberResponse = {
  userId: UUID;
  email: string;
  fullName: string;
  role: GroupRole;
  joinedAt: ISODateString;
};

// --- expenses ---
export type ExactShareRequest = { userId: UUID; amount: MoneyString };
// EQUAL needs participantIds (and no exactShares); EXACT needs exactShares (and no participantIds).
export type CreateExpenseRequest = {
  amount: MoneyString;
  description: string;
  paidBy: UUID;
  splitType: SplitType;
  participantIds?: UUID[];
  exactShares?: ExactShareRequest[];
};
export type SplitResponse = { userId: UUID; fullName: string; shareAmount: MoneyAmount };
export type ExpenseSummaryResponse = {
  id: UUID;
  amount: MoneyAmount;
  description: string;
  paidById: UUID;
  paidByName: string;
  splitType: SplitType;
  createdAt: ISODateString;
};
export type ExpenseResponse = ExpenseSummaryResponse & { splits: SplitResponse[] };

// --- balances / settlements ---
// balance > 0: the group owes this user; < 0: this user owes the group
export type BalanceResponse = { userId: UUID; fullName: string; balance: MoneyAmount };
export type TransferResponse = {
  fromUserId: UUID;
  fromUserName: string;
  toUserId: UUID;
  toUserName: string;
  amount: MoneyAmount;
};
export type GroupBalancesResponse = { balances: BalanceResponse[]; transfers: TransferResponse[] };
export type CreateSettlementRequest = { fromUserId: UUID; toUserId: UUID; amount: MoneyString };
export type SettlementResponse = {
  id: UUID;
  fromUserId: UUID;
  fromUserName: string;
  toUserId: UUID;
  toUserName: string;
  amount: MoneyAmount;
  createdAt: ISODateString;
};
