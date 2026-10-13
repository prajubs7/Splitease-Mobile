import React from 'react';
import { Text, View } from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';

export const BalancesTab = (): React.ReactElement => (
  <Screen>
    <View>
      <Text>Balances</Text>
      <EmptyState title="No balances" message="Once expenses are added, balances will appear here." />
    </View>
  </Screen>
);

export default BalancesTab;
