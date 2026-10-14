import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { TextField } from '../../components/TextField';
import { applyServerErrors } from '../../features/auth/applyServerErrors';
import { RegisterForm, registerSchema } from '../../features/auth/schemas';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../store/AuthProvider';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen = ({ navigation }: Props): React.ReactElement => {
  const { register } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  const onSubmit = handleSubmit(async values => {
    console.log("Register values ", values);
    setFormError(null);
    try {
      const res = await register(values);
      console.log("Register result ", res);
    } catch (e) {
      setFormError(applyServerErrors(e, setError, ['fullName', 'email', 'password']));
    }
  });

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Create account</Text>
        <Controller
          control={control}
          name="fullName"
          render={({ field }) => (
            <TextField
              label="Full name"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Jane Doe"
              autoCapitalize="words"
              autoComplete="name"
              error={errors.fullName?.message}
            />
          )}
        />
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
              placeholder="At least 8 characters"
              autoCapitalize="none"
              autoComplete="new-password"
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />
        {formError ? <Text style={styles.formError}>{formError}</Text> : null}
        <Button label="Register" onPress={onSubmit} loading={isSubmitting} />
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Already have an account? Sign in
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

export default RegisterScreen;
