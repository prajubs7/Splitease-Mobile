import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import GroupsScreen from '../screens/groups/GroupsScreen';
import { useAuth } from '../store/AuthProvider';
import { colors } from '../theme/colors';
import type { AppTabsParamList } from './types';

const Tab = createBottomTabNavigator<AppTabsParamList>();

// Minimal account tab so the user can log out; richer profile content can come later.
const AccountScreen = (): React.ReactElement => {
  const { user, logout } = useAuth();
  return (
    <Screen>
      <Text style={styles.name}>{user?.fullName}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Button label="Log out" onPress={logout} />
    </Screen>
  );
};

export const AppTabs = (): React.ReactElement => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Groups" component={GroupsScreen} />
    <Tab.Screen name="Account" component={AccountScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  name: { fontSize: 22, fontWeight: '700', color: colors.text },
  email: { color: colors.textMuted, marginBottom: 24 },
});

export default AppTabs;
