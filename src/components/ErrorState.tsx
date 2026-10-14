import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type ErrorStateProps = {
  message?: string;
};

export const ErrorState = ({ message = 'Something went wrong.' }: ErrorStateProps): React.ReactElement => (
  <View style={styles.container}>
    <Text style={styles.title}>Unable to load data</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  message: {
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default ErrorState;
