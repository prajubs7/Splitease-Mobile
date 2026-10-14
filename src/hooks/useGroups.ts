import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/keys';
import type { CreateGroupRequest } from '@/api/types';
import * as groupsApi from '@/services/group';

const PAGE_SIZE = 20;

export const useGroups = () =>
  useInfiniteQuery({
    queryKey: queryKeys.groups,
    queryFn: ({ pageParam }) => groupsApi.fetchGroups(pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      const nextPage = lastPage.page.number + 1;
      return nextPage < lastPage.page.totalPages ? nextPage : undefined;
    },
  });

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGroupRequest) => groupsApi.createGroup(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.groups });
    },
  });
};

export const useGroup = (groupId: string) =>
  useQuery({
    queryKey: queryKeys.group(groupId),
    queryFn: () => groupsApi.fetchGroupById(groupId),
    enabled: groupId.length > 0,
  });

export const useMembers = (groupId: string) =>
  useQuery({
    queryKey: queryKeys.groupMembers(groupId),
    queryFn: () => groupsApi.fetchMembers(groupId),
    enabled: groupId.length > 0,
  });

export const useAddMember = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => groupsApi.addMember(groupId, { email }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.groupMembers(groupId) });
    },
  });
};
