import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Card } from './Card';

interface SlotCardProps {
  time: string;
  freeCount: number;
  totalCount: number;
  onPress?: () => void;
}

export const SlotCard: React.FC<SlotCardProps> = ({ time, freeCount, totalCount, onPress }) => {
  const isPerfect = freeCount === totalCount;

  return (
    <Card 
      variant={isPerfect ? 'mint' : 'peach'} 
      style={styles.container} 
      onPress={onPress}
    >
      <Text style={styles.time}>{time}</Text>
      <Text style={[styles.stats, { color: isPerfect ? colors.mintPunch : colors.peachPunch }]}>
        {freeCount} of {totalCount} free
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    gap: spacing[1],
  },
  time: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textPrimary,
  },
  stats: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
  },
});
