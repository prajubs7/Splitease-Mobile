import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type EmptyStateProps = {
  title?: string;
  message?: string;
};

export const EmptyState = ({ title = 'No items yet', message = 'Add the first item to get started.' }: EmptyStateProps): React.ReactElement => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  message: {
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default EmptyState;
