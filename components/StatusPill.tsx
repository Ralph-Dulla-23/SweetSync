import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { colors } from '@/constants/theme';
import { StatusVariant as GlobalStatusVariant } from '@/types';
import { styles } from './StatusPill.styles';

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
