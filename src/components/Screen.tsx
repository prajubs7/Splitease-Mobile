import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

type ScreenProps = {
  children: React.ReactNode;
  padded?: boolean;
};

export const Screen = ({ children, padded = true }: ScreenProps): React.ReactElement => (
  <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={padded ? styles.container : undefined}>{children}</ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
});

export default Screen;
