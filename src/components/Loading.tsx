import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export const Loading = (): React.ReactElement => (
  <View style={styles.container}>
    <ActivityIndicator color={colors.primary} size="large" />
    <Text style={styles.label}>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  label: {
    marginTop: 12,
    color: colors.textMuted,
  },
});

export default Loading;
