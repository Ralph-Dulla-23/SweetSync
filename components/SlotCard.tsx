import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Card } from './Card';
import { styles } from './SlotCard.styles';

interface SlotCardProps {
  time: string;
  freeCount: number;
  totalCount: number;
  onPress?: () => void;
}

export const SlotCard = React.memo(({ time, freeCount, totalCount, onPress }: SlotCardProps) => {
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
});


