import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Card } from './Card';
import { styles } from './SlotCard.styles';
import { Sparkle } from 'phosphor-react-native';

interface SlotCardProps {
  time: string;
  freeCount: number;
  totalCount: number;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  transparent?: boolean;
}

export const SlotCard = React.memo(({ time, freeCount, totalCount, onPress, style, transparent }: SlotCardProps) => {
  const isPerfect = freeCount === totalCount;

  const content = (
    <View style={[styles.content, style]}>
      <View style={styles.left}>
        <Text style={styles.time}>{time}</Text>
        <Text style={[styles.stats, { color: isPerfect ? colors.mintPunch : colors.textSecondary }]}>
          {freeCount} of {totalCount} friends free
        </Text>
      </View>
      {isPerfect && (
        <View style={styles.perfectBadge}>
          <Sparkle size={12} color={colors.mintPunch} weight="fill" />
          <Text style={styles.perfectText}>Perfect</Text>
        </View>
      )}
    </View>
  );

  if (transparent) {
    return content;
  }

  return (
    <Card 
      variant={isPerfect ? 'mint' : 'neutral'} 
      onPress={onPress}
      style={style}
    >
      {content}
    </Card>
  );
});


