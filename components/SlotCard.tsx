import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Card } from './Card';
import { styles } from './SlotCard.styles';
import { Sparkle } from 'phosphor-react-native';

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
      variant={isPerfect ? 'mint' : 'neutral'} 
      onPress={onPress}
    >
      <View style={styles.content}>
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
    </Card>
  );
});


