import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { StatusVariant as GlobalStatusVariant } from '@/types';

export type StatusVariant = GlobalStatusVariant;

interface StatusPillProps {

  label: string;
  variant?: StatusVariant;
  style?: ViewStyle;
}

const variantStyles: Record<StatusVariant, { background: string; text: string }> = {
  peach: { background: colors.peachSoft, text: colors.peachDeep },
  indigo: { background: colors.indigoSoft, text: colors.indigoDeep },
  mint: { background: colors.mintSoft, text: colors.mintPunch },
  neutral: { background: colors.indigoBase, text: colors.textSecondary },
  success: { background: colors.mintSoft, text: colors.mintPunch },
  pending: { background: colors.peachSoft, text: colors.peachDeep },
};

export const StatusPill = React.memo(({ label, variant = 'neutral', style }: StatusPillProps) => {
  const { background, text } = variantStyles[variant];

  return (
    <View style={[styles.pill, { backgroundColor: background }, style]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    letterSpacing: 0.02 * 11,
  },
});
