import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
  View
} from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'indigo' | 'ghost';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  onPress,
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isIndigo = variant === 'indigo';
  const isGhost = variant === 'ghost';

  const buttonStyles = [
    styles.base,
    isPrimary && styles.primary,
    isSecondary && styles.secondary,
    isIndigo && styles.indigo,
    isGhost && styles.ghost,
    disabled && styles.disabled,
    style,
  ] as ViewStyle[];

  const titleStyles = [
    styles.text,
    isPrimary && styles.textPrimary,
    isSecondary && styles.textSecondary,
    isIndigo && styles.textIndigo,
    isGhost && styles.textGhost,
    disabled && styles.textDisabled,
    textStyle,
  ] as TextStyle[];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={buttonStyles}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary || isGhost ? colors.peachPunch : '#FFFFFF'} />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={titleStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.peachPunch,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.peachPunch,
  },
  indigo: {
    backgroundColor: colors.indigoPunch,
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  disabled: {
    backgroundColor: colors.textTertiary,
    borderColor: colors.textTertiary,
  },
  text: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    textAlign: 'center',
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: colors.peachPunch,
  },
  textIndigo: {
    color: '#FFFFFF',
  },
  textGhost: {
    color: colors.textSecondary,
  },
  textDisabled: {
    color: '#FFFFFF',
  },
  iconContainer: {
    marginRight: spacing[2],
  },
});
