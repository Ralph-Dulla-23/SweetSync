import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { Card } from './Card';
import { spacing } from '@/constants/theme';

export const DashboardHeroSkeleton = () => {
  return (
    <Card variant="peach" style={styles.container}>
      <View style={styles.content}>
        <Skeleton width={120} height={12} style={styles.margin} />
        <Skeleton width="90%" height={28} style={styles.margin} />
        <Skeleton width="70%" height={16} style={styles.margin} />
        <Skeleton width={140} height={44} style={styles.cta} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[5],
    marginTop: spacing[2],
    marginBottom: spacing[4],
    padding: spacing[5],
  },
  content: {
    gap: spacing[2],
  },
  margin: {
    marginBottom: spacing[1],
  },
  cta: {
    marginTop: spacing[2],
    borderRadius: 12,
  }
});
