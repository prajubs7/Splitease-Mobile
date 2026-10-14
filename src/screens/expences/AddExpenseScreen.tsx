import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ApiError } from '@/api/errors';
import type { MemberResponse, SplitType } from '@/api/types';
import { Button } from '@/components/Button';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useCreateExpense } from '@/hooks/useExpences';
import { useMembers } from '@/hooks/useGroups';
import { useAuth } from '@/store/AuthProvider';
import { formatMoney, fromCents, splitEqual, toCents } from '@/lib/money';
import type { AppStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

type Props = NativeStackScreenProps<AppStackParamList, 'AddExpense'>;

const parsePositiveCents = (value: string): number | null => {
  try {
    const cents = toCents(value);
    return cents > 0 ? cents : null;
  } catch {
    return null;
  }
};

const MemberChoice = ({
  member,
  selected,
  label,
  onPress,
}: {
  member: MemberResponse;
  selected: boolean;
  label: string;
  onPress: () => void;
}): React.ReactElement => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected }}
    onPress={onPress}
    style={styles.memberChoice}
  >
    <View style={styles.choiceText}>
      <Text style={styles.memberName}>{member.fullName}</Text>
      <Text style={styles.memberEmail}>{member.email}</Text>
    </View>
    <Text style={[styles.choiceIndicator, selected && styles.choiceIndicatorSelected]}>
      {selected ? (label === 'radio' ? '●' : '✓') : label === 'radio' ? '○' : '＋'}
    </Text>
  </Pressable>
);

export const AddExpenseScreen = ({ route, navigation }: Props): React.ReactElement => {
  const { groupId } = route.params;
  const { user } = useAuth();
  const membersQuery = useMembers(groupId);
  const createExpense = useCreateExpense(groupId);
  const members = useMemo(() => membersQuery.data ?? [], [membersQuery.data]);

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState<SplitType>('EQUAL');
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [exactShares, setExactShares] = useState<Record<string, string>>({});

  useEffect(() => {
    if (members.length === 0) {
      return;
    }
    setPaidBy(current => current || members.find(member => member.userId === user?.id)?.userId || members[0].userId);
    setParticipantIds(current => (current.length > 0 ? current : members.map(member => member.userId)));
  }, [members, user?.id]);

  const totalCents = parsePositiveCents(amount);
  const exactValues = members.map(member => ({
    userId: member.userId,
    cents: parsePositiveCents(exactShares[member.userId] ?? ''),
  }));
  const exactTotal = exactValues.reduce((sum, share) => sum + (share.cents ?? 0), 0);
  const exactAmountsValid =
    exactValues.length > 0 && exactValues.every(share => share.cents !== null);
  const exactRemaining = totalCents === null ? null : totalCents - exactTotal;
  const exactSplitValid =
    totalCents !== null && exactAmountsValid && exactRemaining === 0;

  const equalShares = useMemo(() => {
    if (totalCents === null || participantIds.length === 0) {
      return null;
    }
    try {
      return splitEqual(totalCents, participantIds.length);
    } catch {
      return null;
    }
  }, [participantIds.length, totalCents]);

  const isValid =
    description.trim().length > 0 &&
    description.trim().length <= 255 &&
    paidBy.length > 0 &&
    members.some(member => member.userId === paidBy) &&
    (splitType === 'EQUAL'
      ? totalCents !== null && participantIds.length > 0 && equalShares !== null
      : exactSplitValid);

  const errorMessage =
    createExpense.error instanceof ApiError
      ? createExpense.error.detail
      : createExpense.error?.message ?? 'Could not save this expense. Please try again.';

  const toggleParticipant = (userId: string): void => {
    setParticipantIds(current =>
      current.includes(userId) ? current.filter(id => id !== userId) : [...current, userId],
    );
  };

  const submit = (): void => {
    if (!isValid || totalCents === null) {
      return;
    }
    createExpense.mutate(
      splitType === 'EQUAL'
        ? {
            amount: fromCents(totalCents),
            description: description.trim(),
            paidBy,
            splitType,
            participantIds,
          }
        : {
            amount: fromCents(totalCents),
            description: description.trim(),
            paidBy,
            splitType,
            exactShares: exactValues.map(share => ({
              userId: share.userId,
              amount: fromCents(share.cents ?? 0),
            })),
          },
      { onSuccess: () => navigation.goBack() },
    );
  };

  if (membersQuery.isPending) {
    return (
      <View style={styles.loading}>
        <Loading />
      </View>
    );
  }

  if (membersQuery.isError) {
    return (
      <Screen>
        <ErrorState message={membersQuery.error.message} />
        <Button label="Try again" onPress={() => membersQuery.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Back to group</Text>
        </Pressable>
        <Text style={styles.title}>Add expense</Text>
        <Text style={styles.subtitle}>Record a shared cost for this group.</Text>

        <TextField
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />
        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. Groceries"
          maxLength={255}
        />
        <Text style={styles.sectionTitle}>Paid by</Text>
        {members.map(member => (
          <MemberChoice
            key={member.userId}
            member={member}
            selected={paidBy === member.userId}
            label="radio"
            onPress={() => setPaidBy(member.userId)}
          />
        ))}

        <Text style={styles.sectionTitle}>Split type</Text>
        <View accessibilityRole="tablist" style={styles.splitToggle}>
          {(['EQUAL', 'EXACT'] as const).map(type => (
            <Pressable
              key={type}
              accessibilityRole="tab"
              accessibilityState={{ selected: splitType === type }}
              onPress={() => setSplitType(type)}
              style={[styles.splitOption, splitType === type && styles.splitOptionSelected]}
            >
              <Text style={[styles.splitLabel, splitType === type && styles.splitLabelSelected]}>
                {type === 'EQUAL' ? 'Equal' : 'Exact'}
              </Text>
            </Pressable>
          ))}
        </View>

        {splitType === 'EQUAL' ? (
          <>
            <Text style={styles.sectionTitle}>Participants</Text>
            {members.map(member => {
              const shareIndex = participantIds.indexOf(member.userId);
              const share = shareIndex >= 0 ? equalShares?.[shareIndex] : undefined;
              return (
                <View key={member.userId}>
                  <MemberChoice
                    member={member}
                    selected={shareIndex >= 0}
                    label="checkbox"
                    onPress={() => toggleParticipant(member.userId)}
                  />
                  {share !== undefined ? (
                    <Text style={styles.sharePreview}>Share: {formatMoney(fromCents(share))}</Text>
                  ) : null}
                </View>
              );
            })}
            {totalCents !== null && participantIds.length > 0 && equalShares === null ? (
              <Text style={styles.validation}>Amount is too small to split between everyone selected.</Text>
            ) : null}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Shares</Text>
            <Text style={styles.helper}>Enter each participant’s share of the total.</Text>
            {members.map(member => (
              <TextField
                key={member.userId}
                label={member.fullName}
                value={exactShares[member.userId] ?? ''}
                onChangeText={value =>
                  setExactShares(current => ({ ...current, [member.userId]: value }))
                }
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            ))}
            <Text
              style={[
                styles.remaining,
                exactRemaining === 0 && exactAmountsValid ? styles.remainingComplete : null,
                exactRemaining !== null && exactRemaining < 0 ? styles.validation : null,
              ]}
            >
              {exactRemaining === null
                ? 'Enter a valid total amount to see what remains.'
                : exactRemaining >= 0
                  ? `Remaining: ${formatMoney(fromCents(exactRemaining))}`
                  : `Over by: ${formatMoney(fromCents(Math.abs(exactRemaining)))}`}
            </Text>
          </>
        )}

        {createExpense.isError ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <Button
          label="Save expense"
          onPress={submit}
          disabled={!isValid}
          loading={createExpense.isPending}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
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
  subtitle: {
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 8,
  },
  memberChoice: {
    minHeight: 52,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  choiceText: {
    flex: 1,
  },
  memberName: {
    color: colors.text,
    fontWeight: '600',
  },
  memberEmail: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  choiceIndicator: {
    color: colors.textMuted,
    fontSize: 20,
    paddingHorizontal: 4,
  },
  choiceIndicatorSelected: {
    color: colors.primary,
  },
  splitToggle: {
    flexDirection: 'row',
    padding: 4,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  splitOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  splitOptionSelected: {
    backgroundColor: colors.primary,
  },
  splitLabel: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  splitLabelSelected: {
    color: '#FFFFFF',
  },
  sharePreview: {
    color: colors.primary,
    fontSize: 13,
    marginTop: -3,
    marginBottom: 8,
    marginLeft: 12,
  },
  helper: {
    color: colors.textMuted,
    marginBottom: 12,
  },
  remaining: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 12,
  },
  remainingComplete: {
    color: colors.success,
  },
  validation: {
    color: colors.danger,
    marginBottom: 12,
  },
  error: {
    color: colors.danger,
    marginBottom: 12,
  },
});

export default AddExpenseScreen;
