export type CreateGroupRequest = {
  name: string;
};

export const fetchGroups = async () => [];

export const fetchGroupById = async (_groupId: string) => ({
  id: _groupId,
  name: 'Demo Group',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const createGroup = async (payload: CreateGroupRequest) => ({
  id: 'demo-group-id',
  name: payload.name,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const fetchMembers = async (_groupId: string) => [];

export const addMember = async (_groupId: string, _email: string) => ({
  id: 'demo-member-id',
  userId: 'demo-user-id',
  groupId: _groupId,
  email: _email,
  fullName: 'Demo Member',
  joinedAt: new Date().toISOString(),
});
