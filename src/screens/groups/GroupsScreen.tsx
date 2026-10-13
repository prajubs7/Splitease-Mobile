import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { colors } from '../../theme/colors';

export const GroupsScreen = (): React.ReactElement => (
  <Screen>
    <View style={styles.header}>
      <Text style={styles.title}>Groups</Text>
    </View>
    <EmptyState title="No groups yet" message="Create your first group to split expenses." />
  </Screen>
);

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
});

export default GroupsScreen;
