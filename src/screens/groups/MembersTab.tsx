import React from 'react';
import { Text, View } from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';

export const MembersTab = (): React.ReactElement => (
  <Screen>
    <View>
      <Text>Members</Text>
      <EmptyState title="No members yet" message="Invite someone to this group." />
    </View>
  </Screen>
);

export default MembersTab;
