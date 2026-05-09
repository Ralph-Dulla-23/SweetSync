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
  title?: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Button = React.memo(({
  onPress,
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  children,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) => {
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
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary || isGhost ? colors.peachPunch : colors.white} />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          {title ? <Text style={titleStyles}>{title}</Text> : null}
          {children}
        </>
      )}
    </TouchableOpacity>
  );
});

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
    color: colors.white,
  },
  textSecondary: {
    color: colors.peachPunch,
  },
  textIndigo: {
    color: colors.white,
  },
  textGhost: {
    color: colors.textSecondary,
  },
  textDisabled: {
    color: colors.white,
  },
  iconContainer: {
    marginRight: spacing[2],
  },
});
