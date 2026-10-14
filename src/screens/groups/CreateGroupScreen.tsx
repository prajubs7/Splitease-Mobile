import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ApiError } from '@/api/errors';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useCreateGroup } from '@/hooks/useGroups';
import type { AppStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

type Props = NativeStackScreenProps<AppStackParamList, 'CreateGroup'>;

export const CreateGroupScreen = ({ navigation }: Props): React.ReactElement => {
  const [name, setName] = useState('');
  const createGroup = useCreateGroup();
  const errorMessage =
    createGroup.error instanceof ApiError
      ? createGroup.error.detail
      : createGroup.error?.message ?? 'Could not create the group. Please try again.';

  const submit = (): void => {
    const groupName = name.trim();
    if (!groupName) {
      return;
    }
    createGroup.mutate(
      { name: groupName },
      { onSuccess: () => navigation.goBack() },
    );
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.title}>Create a group</Text>
          <Text style={styles.subtitle}>Give your group a name to get started.</Text>
        </View>
        <TextField
          label="Group name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Weekend trip"
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        {createGroup.isError ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <Button
          label="Create group"
          onPress={submit}
          disabled={!name.trim()}
          loading={createGroup.isPending}
        />
        <View style={styles.cancel}>
          <Button label="Cancel" onPress={() => navigation.goBack()} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 6,
  },
  error: {
    color: colors.danger,
    marginBottom: 12,
  },
  cancel: {
    marginTop: 12,
  },
});

export default CreateGroupScreen;
