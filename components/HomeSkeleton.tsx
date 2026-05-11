import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DashboardHeroSkeleton } from './DashboardHeroSkeleton';
import { RoomCardSkeleton } from './RoomCardSkeleton';
import { Skeleton } from './Skeleton';
import { spacing } from '@/constants/theme';

export const HomeSkeleton = () => {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <DashboardHeroSkeleton />
      
      <View style={styles.sectionHeader}>
        <Skeleton width={120} height={24} />
      </View>

      <View style={styles.cardGapContainer}>
        <RoomCardSkeleton />
        <RoomCardSkeleton />
        <RoomCardSkeleton />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: spacing[4],
    paddingBottom: spacing[10],
  },
  sectionHeader: {
    paddingHorizontal: spacing[5],
    marginTop: spacing[6],
    marginBottom: spacing[3],
  },
  cardGapContainer: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
});
