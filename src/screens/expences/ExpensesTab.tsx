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
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { useExpenses } from '@/hooks/useExpences';
import { formatDate } from '@/lib/format';
import { formatMoney } from '@/lib/money';
import type { AppStackParamList } from '@/navigation/types';
import type { ExpenseSummaryResponse } from '@/api/types';
import { colors } from '@/theme/colors';

type Props = { groupId: string };
type Navigation = NativeStackNavigationProp<AppStackParamList>;

const ExpenseRow = ({
  expense,
  onPress,
}: {
  expense: ExpenseSummaryResponse;
  onPress: () => void;
}): React.ReactElement => (
  <Pressable accessibilityRole="button" onPress={onPress} style={styles.expenseRow}>
    <View style={styles.expenseIcon}>
      <Text style={styles.expenseIconLabel}>$</Text>
    </View>
    <View style={styles.expenseInfo}>
      <Text style={styles.description} numberOfLines={1}>
        {expense.description}
      </Text>
      <Text style={styles.meta}>
        Paid by {expense.paidByName} · {formatDate(expense.createdAt)}
      </Text>
    </View>
    <Text style={styles.amount}>{formatMoney(expense.amount)}</Text>
  </Pressable>
);

export const ExpensesTab = ({ groupId }: Props): React.ReactElement => {
  const navigation = useNavigation<Navigation>();
  const expensesQuery = useExpenses(groupId);
  const expenses = expensesQuery.data?.pages.flatMap(page => page.content) ?? [];

  const openExpense = useCallback(
    (expenseId: string) => navigation.navigate('ExpenseDetail', { groupId, expenseId }),
    [groupId, navigation],
  );

  if (expensesQuery.isPending) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {expensesQuery.isError && expenses.length === 0 ? (
        <View style={styles.errorContainer}>
          <ErrorState message={expensesQuery.error.message} />
          <Button label="Try again" onPress={() => expensesQuery.refetch()} />
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={expense => expense.id}
          renderItem={({ item }) => (
            <ExpenseRow expense={item} onPress={() => openExpense(item.id)} />
          )}
          contentContainerStyle={expenses.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={
            <EmptyState
              title="No expenses yet"
              message="Add an expense to start tracking shared costs."
            />
          }
          ListFooterComponent={
            expensesQuery.isFetchingNextPage ? (
              <ActivityIndicator color={colors.primary} style={styles.footer} />
            ) : undefined
          }
          onEndReached={() => {
            if (expensesQuery.hasNextPage && !expensesQuery.isFetchingNextPage) {
              expensesQuery.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={expensesQuery.isRefetching && !expensesQuery.isFetchingNextPage}
              onRefresh={() => {
                expensesQuery.refetch();
              }}
              tintColor={colors.primary}
            />
          }
        />
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add expense"
        onPress={() => navigation.navigate('AddExpense', { groupId })}
        style={styles.fab}
      >
        <Text style={styles.fabLabel}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    paddingHorizontal: 20,
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
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  expenseIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseIconLabel: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  expenseInfo: {
    flex: 1,
    marginLeft: 10,
  },
  description: {
    color: colors.text,
    fontWeight: '600',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  amount: {
    color: colors.text,
    fontWeight: '700',
    marginLeft: 8,
  },
  footer: {
    paddingVertical: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    elevation: 5,
  },
  fabLabel: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 36,
  },
});

export default ExpensesTab;
