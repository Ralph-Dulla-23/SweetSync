import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radius } from '@/constants/theme';

export type CardVariant = 'peach' | 'indigo' | 'mint' | 'neutral';

const cardStyles: Record<CardVariant, { background: string; borderColor: string }> = {
  peach:   { background: colors.peachBase,  borderColor: colors.peachSoft  },
  indigo:  { background: colors.indigoBase, borderColor: colors.indigoSoft },
  mint:    { background: colors.mintBase,   borderColor: colors.mintSoft   },
  neutral: { background: '#F7F6F3',         borderColor: colors.borderDefault },
};

interface CardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({
  variant = 'neutral',
  children,
  style,
}: CardProps) {
  const { background, borderColor } = cardStyles[variant];
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
