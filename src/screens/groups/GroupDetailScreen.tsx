import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@/components/Button';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { useGroup } from '@/hooks/useGroups';
import type { AppStackParamList } from '@/navigation/types';
import { BalancesTab } from '@/screens/balances/BalancesTab';
import { ExpensesTab } from '@/screens/expences/ExpensesTab';
import { MembersTab } from './MembersTab';
import { colors } from '@/theme/colors';

type Props = NativeStackScreenProps<AppStackParamList, 'GroupDetail'>;
type GroupTab = 'Expenses' | 'Balances' | 'Members';
const TABS: GroupTab[] = ['Expenses', 'Balances', 'Members'];

export const GroupDetailScreen = ({ route, navigation }: Props): React.ReactElement => {
  const { groupId } = route.params;
  const [selectedTab, setSelectedTab] = useState<GroupTab>('Expenses');
  const groupQuery = useGroup(groupId);

  if (groupQuery.isPending) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Loading />
      </SafeAreaView>
    );
  }

  if (groupQuery.isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState message={groupQuery.error.message} />
        <Button label="Try again" onPress={() => groupQuery.refetch()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Groups</Text>
        </Pressable>
        <Text style={styles.title}>{groupQuery.data.name}</Text>
        <Text style={styles.meta}>
          Created by {groupQuery.data.createdByName} ·{' '}
          {groupQuery.data.myRole === 'OWNER' ? 'Owner' : 'Member'}
        </Text>
      </View>
      <View accessibilityRole="tablist" style={styles.tabs}>
        {TABS.map(tab => (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: selectedTab === tab }}
            onPress={() => setSelectedTab(tab)}
            style={[styles.tab, selectedTab === tab && styles.selectedTab]}
          >
            <Text style={[styles.tabLabel, selectedTab === tab && styles.selectedTabLabel]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.content}>
        {selectedTab === 'Expenses' ? (
          <ExpensesTab groupId={groupId} />
        ) : selectedTab === 'Balances' ? (
          <BalancesTab />
        ) : (
          <MembersTab groupId={groupId} />
        )}
      </View>
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
    paddingTop: 8,
    paddingBottom: 16,
  },
  back: {
    color: colors.primary,
    fontSize: 16,
    marginBottom: 16,
  },
  title: {
    color: colors.text,
    fontSize: 27,
    fontWeight: '700',
  },
  meta: {
    color: colors.textMuted,
    marginTop: 5,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 4,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 9,
  },
  selectedTab: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  selectedTabLabel: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    marginTop: 8,
  },
});

export default GroupDetailScreen;
