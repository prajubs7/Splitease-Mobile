import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { GroupResponse } from '@/api/types';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { useGroups } from '@/hooks/useGroups';
import type { AppStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

const GroupCard = ({
  group,
  onPress,
}: {
  group: GroupResponse;
  onPress: () => void;
}): React.ReactElement => (
  <Pressable accessibilityRole="button" onPress={onPress} style={styles.groupCard}>
    <View style={styles.groupIcon}>
      <Text style={styles.groupIconText}>{group.name.slice(0, 1).toUpperCase()}</Text>
    </View>
    <View style={styles.groupInfo}>
      <Text style={styles.groupName}>{group.name}</Text>
      <Text style={styles.groupMeta}>{group.myRole === 'OWNER' ? 'Owner' : 'Member'}</Text>
    </View>
    <Text style={styles.chevron}>›</Text>
  </Pressable>
);

export const GroupsScreen = (): React.ReactElement => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const groupsQuery = useGroups();
  const groups = groupsQuery.data?.pages.flatMap(page => page.content) ?? [];
  const paginationFooter: React.ReactElement | undefined = groupsQuery.isFetchingNextPage ? (
    <ActivityIndicator color={colors.primary} style={styles.footer} />
  ) : undefined;

  const openGroup = useCallback(
    (groupId: string) => navigation.navigate('GroupDetail', { groupId }),
    [navigation],
  );

  if (groupsQuery.isPending) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Loading />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
        <Text style={styles.subtitle}>Split expenses with your people</Text>
      </View>
      {groupsQuery.isError && groups.length === 0 ? (
        <View style={styles.errorContainer}>
          <ErrorState message={groupsQuery.error.message} />
          <Button label="Try again" onPress={() => groupsQuery.refetch()} />
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={group => group.id}
          renderItem={({ item }) => (
            <GroupCard group={item} onPress={() => openGroup(item.id)} />
          )}
          contentContainerStyle={groups.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={
            <EmptyState
              title="No groups yet"
              message="Create your first group to split expenses."
            />
          }
          ListFooterComponent={paginationFooter}
          onEndReached={() => {
            if (groupsQuery.hasNextPage && !groupsQuery.isFetchingNextPage) {
              groupsQuery.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={groupsQuery.isRefetching && !groupsQuery.isFetchingNextPage}
              onRefresh={() => {
                groupsQuery.refetch();
              }}
              tintColor={colors.primary}
            />
          }
        />
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create group"
        onPress={() => navigation.navigate('CreateGroup')}
        style={styles.fab}
      >
        <Text style={styles.fabLabel}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 96,
  },
  emptyList: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 96,
  },
  errorContainer: {
    paddingHorizontal: 20,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  groupIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8EEFF',
  },
  groupIconText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  groupInfo: {
    flex: 1,
    marginLeft: 12,
  },
  groupName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  groupMeta: {
    color: colors.textMuted,
    marginTop: 3,
    fontSize: 13,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 26,
    marginLeft: 8,
  },
  footer: {
    paddingVertical: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    elevation: 5,
  },
  fabLabel: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '400',
  },
});

export default GroupsScreen;
