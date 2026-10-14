import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { TextField } from '@/components/TextField';
import { useAddMember, useMembers } from '@/hooks/useGroups';
import { colors } from '@/theme/colors';

type Props = { groupId: string };

const getAddMemberError = (error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.status === 403) {
      return 'Only the group owner can add members.';
    }
    if (error.status === 404) {
      return 'No user was found with that email address.';
    }
    return error.detail;
  }
  return error instanceof Error ? error.message : 'Could not add this member. Please try again.';
};

export const MembersTab = ({ groupId }: Props): React.ReactElement => {
  const [email, setEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const membersQuery = useMembers(groupId);
  const addMember = useAddMember(groupId);

  const submit = async (): Promise<void> => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      return;
    }
    setFormMessage('');
    try {
      await addMember.mutateAsync(normalizedEmail);
      setEmail('');
      setFormMessage('Member added to the group.');
    } catch (error) {
      setFormMessage(getAddMemberError(error));
    }
  };

  if (membersQuery.isPending) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Members</Text>
        <TextField
          label="Add by email"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        <Button
          label="Add member"
          onPress={submit}
          disabled={!email.trim()}
          loading={addMember.isPending}
        />
        {formMessage ? (
          <Text
            accessibilityRole="alert"
            style={[
              styles.formMessage,
              formMessage === 'Member added to the group.' && styles.successMessage,
            ]}
          >
            {formMessage}
          </Text>
        ) : null}
      </View>
      {membersQuery.isError ? (
        <ErrorState message={membersQuery.error.message} />
      ) : membersQuery.data.length === 0 ? (
        <EmptyState title="No members yet" message="Add someone to this group by email." />
      ) : (
        <FlatList
          data={membersQuery.data}
          keyExtractor={member => member.userId}
          contentContainerStyle={styles.memberList}
          renderItem={({ item }) => (
            <View style={styles.memberRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarLabel}>{item.fullName.slice(0, 1).toUpperCase()}</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{item.fullName}</Text>
                <Text style={styles.memberEmail}>{item.email}</Text>
              </View>
              <Text style={styles.role}>{item.role}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  formMessage: {
    color: colors.danger,
    marginTop: 10,
  },
  successMessage: {
    color: colors.success,
  },
  memberList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 10,
  },
  memberName: {
    color: colors.text,
    fontWeight: '600',
  },
  memberEmail: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  role: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MembersTab;
