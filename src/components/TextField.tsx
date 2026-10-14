import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../theme/colors';

type TextFieldProps = Pick<
  TextInputProps,
  | 'value'
  | 'onChangeText'
  | 'onBlur'
  | 'placeholder'
  | 'secureTextEntry'
  | 'autoCapitalize'
  | 'autoComplete'
  | 'keyboardType'
  | 'returnKeyType'
  | 'onSubmitEditing'
  | 'editable'
  | 'maxLength'
> & {
  label?: string;
  error?: string;
};

export const TextField = ({
  label,
  error,
  autoCapitalize = 'sentences',
  ...inputProps
}: TextFieldProps): React.ReactElement => (
  <View style={styles.container}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <TextInput
      {...inputProps}
      autoCapitalize={autoCapitalize}
      style={[styles.input, error ? styles.inputError : null]}
      placeholderTextColor={colors.textMuted}
    />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: colors.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    marginTop: 6,
  },
});

export default TextField;
