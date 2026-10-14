import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { useExpense } from '@/hooks/useExpences';
import { formatDate } from '@/lib/format';
import { formatMoney } from '@/lib/money';
import type { AppStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

type Props = NativeStackScreenProps<AppStackParamList, 'ExpenseDetail'>;

export const ExpenseDetailScreen = ({ route, navigation }: Props): React.ReactElement => {
  const { groupId, expenseId } = route.params;
  const expenseQuery = useExpense(groupId, expenseId);

  if (expenseQuery.isPending) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Loading />
      </SafeAreaView>
    );
  }

  if (expenseQuery.isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState message={expenseQuery.error.message} />
        <Button label="Try again" onPress={() => expenseQuery.refetch()} />
      </SafeAreaView>
    );
  }

  const expense = expenseQuery.data;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Back to expenses</Text>
        </Pressable>
        <Text style={styles.title}>{expense.description}</Text>
        <Text style={styles.amount}>{formatMoney(expense.amount)}</Text>
        <View style={styles.card}>
          <DetailRow label="Paid by" value={expense.paidByName} />
          <DetailRow label="Split type" value={expense.splitType === 'EQUAL' ? 'Equal' : 'Exact'} />
          <DetailRow label="Date" value={formatDate(expense.createdAt)} />
        </View>
        <Text style={styles.sectionTitle}>Shares</Text>
        {expense.splits.length === 0 ? (
          <EmptyState title="No shares" message="This expense has no participant splits." />
        ) : (
          expense.splits.map(split => (
            <View key={split.userId} style={styles.splitRow}>
              <Text style={styles.splitName}>{split.fullName}</Text>
              <Text style={styles.splitAmount}>{formatMoney(split.shareAmount)}</Text>
            </View>
          ))
        )}
      </View>
    </SafeAreaView>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }): React.ReactElement => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  back: {
    color: colors.primary,
    fontSize: 16,
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
  },
  amount: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 20,
  },
  card: {
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    color: colors.textMuted,
  },
  detailValue: {
    color: colors.text,
    fontWeight: '600',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 10,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    marginBottom: 7,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  splitName: {
    color: colors.text,
    fontWeight: '500',
  },
  splitAmount: {
    color: colors.text,
    fontWeight: '700',
  },
});

export default ExpenseDetailScreen;
