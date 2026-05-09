import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors, spacing, radius } from '@/constants/theme';

export type CardVariant = 'peach' | 'indigo' | 'mint' | 'neutral';

const cardStyles: Record<CardVariant, { background: string; borderColor: string }> = {
  peach:   { background: colors.peachBase,  borderColor: colors.peachSoft  },
  indigo:  { background: colors.indigoPunch, borderColor: colors.indigoDeep },
  mint:    { background: colors.mintBase,   borderColor: colors.mintSoft   },
  neutral: { background: colors.pageBg,         borderColor: colors.borderDefault },
};

interface CardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({
  variant = 'neutral',
  children,
  style,
  onPress,
}: CardProps) {
  const { background, borderColor } = cardStyles[variant];
  
  if (onPress) {
    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: background, borderColor }, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: background, borderColor }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 0.5,
    padding: spacing[4],
  },
});
