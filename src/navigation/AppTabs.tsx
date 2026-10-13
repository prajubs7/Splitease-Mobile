import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const AppTabs = (): React.ReactElement => (
  <View style={styles.placeholder}>
    <Text>AppTabs</Text>
  </View>
);

const styles = StyleSheet.create({
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default AppTabs;
