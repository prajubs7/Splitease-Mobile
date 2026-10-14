import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../components/Splash';
import { useAuth } from '../store/AuthProvider';
import AppTabs from './AppTabs';
import AuthStack from './AuthStack';
import type { AppStackParamList } from './types';
import CreateGroupScreen from '../screens/groups/CreateGroupScreen';
import GroupDetailScreen from '../screens/groups/GroupDetailScreen';
import AddExpenseScreen from '../screens/expences/AddExpenseScreen';
import ExpenseDetailScreen from '../screens/expences/ExpenseDetailScreen';

const AppStack = createNativeStackNavigator<AppStackParamList>();

export const RootNavigator = (): React.ReactElement => {
  const { status } = useAuth();

  if (status === 'loading') {
    return <Splash />;
  }

  if (status === 'signedOut') {
    return <AuthStack />;
  }

  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="AppTabs" component={AppTabs} />
      <AppStack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={{ presentation: 'modal' }}
      />
      <AppStack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <AppStack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ presentation: 'modal' }}
      />
      <AppStack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
    </AppStack.Navigator>
  );
};

export default RootNavigator;
