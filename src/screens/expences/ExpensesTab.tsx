import React from 'react';
import { Text, View } from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';

export const ExpensesTab = (): React.ReactElement => (
  <Screen>
    <View>
      <Text>Expenses</Text>
      <EmptyState title="No expenses yet" message="Add an expense to start tracking shared costs." />
    </View>
  </Screen>
);

export default ExpensesTab;
