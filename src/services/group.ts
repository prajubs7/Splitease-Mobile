import { apiClient } from '@/api/client';
import type {
  AddMemberRequest,
  CreateGroupRequest,
  GroupResponse,
  MemberResponse,
  Page,
} from '@/api/types';

export const fetchGroups = async (page: number, size = 20): Promise<Page<GroupResponse>> =>
  (await apiClient.get<Page<GroupResponse>>('/api/v1/groups', { params: { page, size } })).data;

export const fetchGroupById = async (groupId: string): Promise<GroupResponse> =>
  (await apiClient.get<GroupResponse>(`/api/v1/groups/${groupId}`)).data;

export const createGroup = async (payload: CreateGroupRequest): Promise<GroupResponse> =>
  (await apiClient.post<GroupResponse>('/api/v1/groups', payload)).data;

export const fetchMembers = async (groupId: string): Promise<MemberResponse[]> =>
  (await apiClient.get<MemberResponse[]>(`/api/v1/groups/${groupId}/members`)).data;

export const addMember = async (
  groupId: string,
  payload: AddMemberRequest,
): Promise<MemberResponse> =>
  (await apiClient.post<MemberResponse>(`/api/v1/groups/${groupId}/members`, payload)).data;
