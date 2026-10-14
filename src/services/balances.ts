export const fetchBalances = async (_groupId: string) => ({
  groupId: _groupId,
  userBalances: [{ userId: 'demo-user-id', netCents: 0 }],
  transfers: [],
});

export const createSettlement = async (
  _groupId: string,
  _payload: { fromUserId: string; toUserId: string; amount: string },
) => ({
  id: 'demo-settlement-id',
  groupId: _groupId,
  fromUserId: _payload.fromUserId,
  toUserId: _payload.toUserId,
  amount: _payload.amount,
  createdAt: new Date().toISOString(),
});
