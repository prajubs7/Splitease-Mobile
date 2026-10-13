import React from 'react';
import HealthCheckScreen from '@/screens/dev/HealthCheckScreen';

// TEMPORARY: renders the health check until the real navigators are wired up.
export const RootNavigator = (): React.ReactElement => <HealthCheckScreen />;

export default RootNavigator;
