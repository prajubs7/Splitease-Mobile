import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { TextField } from '../../components/TextField';
import { colors } from '../../theme/colors';

export const LoginScreen = (): React.ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue.</Text>
        <TextField label="Email" value={email} onChangeText={setEmail} placeholder="name@example.com" autoCapitalize="none" />
        <TextField label="Password" value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />
        <Button label="Login" onPress={() => undefined} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    marginBottom: 24,
  },
});

export default LoginScreen;
