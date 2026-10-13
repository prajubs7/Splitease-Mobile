import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { TextField } from '../../components/TextField';
import { colors } from '../../theme/colors';

export const RegisterScreen = (): React.ReactElement => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Create account</Text>
        <TextField label="Full name" value={fullName} onChangeText={setFullName} placeholder="Jane Doe" />
        <TextField label="Email" value={email} onChangeText={setEmail} placeholder="name@example.com" autoCapitalize="none" />
        <TextField label="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry />
        <Button label="Register" onPress={() => undefined} />
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
    marginBottom: 24,
  },
});

export default RegisterScreen;
