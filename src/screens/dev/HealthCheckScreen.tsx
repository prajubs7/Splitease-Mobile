// TEMPORARY: proves the emulator reaches the backend. Remove once navigation (milestone 5) lands.
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { apiClient } from '@/api/client';
import { getApiBaseUrl } from '@/lib/env';

export const HealthCheckScreen = (): React.ReactElement => {
  const [result, setResult] = useState('Checking…');

  useEffect(() => {
    apiClient
      .get('/api/v1/health')
      .then(res => setResult(`HTTP ${res.status}\n${JSON.stringify(res.data, null, 2)}`))
      .catch((e: unknown) =>
        setResult(e instanceof Error ? `Error: ${e.message}` : 'Unknown error'),
      );
  }, []);

  return (
    <Screen>
      <Text style={styles.title}>Health check</Text>
      <Text style={styles.url}>{getApiBaseUrl()}/api/v1/health</Text>
      <Text style={styles.result}>{result}</Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  url: { marginBottom: 16 },
  result: { fontFamily: 'monospace' },
});

export default HealthCheckScreen;
