import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { TextField } from '../../components/TextField';
import { applyServerErrors } from '../../features/auth/applyServerErrors';
import { LoginForm, loginSchema } from '../../features/auth/schemas';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../store/AuthProvider';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props): React.ReactElement => {
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async values => {
    console.log("Login values ", values);
    setFormError(null);
    try {
      await login(values.email, values.password);
    } catch (e) {
      setFormError(applyServerErrors(e, setError, ['email', 'password']));
    }
  });

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue.</Text>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              label="Email"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextField
              label="Password"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Enter password"
              autoCapitalize="none"
              autoComplete="current-password"
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />
        {formError ? <Text style={styles.formError}>{formError}</Text> : null}
        <Button label="Login" onPress={onSubmit} loading={isSubmitting} />
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          No account? Create one
        </Text>
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
  formError: {
    color: colors.danger,
    marginBottom: 12,
  },
  link: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },
});

export default LoginScreen;
