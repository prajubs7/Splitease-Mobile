import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const RootNavigator = (): React.ReactElement => (
  <View style={styles.placeholder}>
    <Text>RootNavigator</Text>
  </View>
);

const styles = StyleSheet.create({
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default RootNavigator;
