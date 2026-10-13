import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

export const Button = ({ label, onPress, disabled = false }: ButtonProps): React.ReactElement => (
  <Pressable
    accessibilityRole="button"
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [styles.button, disabled && styles.buttonDisabled, pressed && styles.buttonPressed]}
  >
    <Text style={styles.label}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;
