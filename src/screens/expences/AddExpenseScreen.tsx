import React from 'react';
import { Text, View } from 'react-native';
import { Screen } from '../../components/Screen';

export const AddExpenseScreen = (): React.ReactElement => (
  <Screen>
    <View>
      <Text>Add expense</Text>
    </View>
  </Screen>
);

export default AddExpenseScreen;
