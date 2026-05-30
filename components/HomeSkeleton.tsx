import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DashboardHeroSkeleton } from './DashboardHeroSkeleton';
import { RoomCardSkeleton } from './RoomCardSkeleton';
import { Skeleton } from './Skeleton';
import { spacing, radius } from '@/constants/theme';

export const HomeSkeleton = () => {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <DashboardHeroSkeleton />
      
      {/* Join Bar Skeleton */}
      <View style={styles.joinBarContainer}>
        <Skeleton height={56} style={{ borderRadius: radius.md }} />
      </View>

      {/* Upcoming Plans Section */}
      <View style={styles.sectionHeader}>
        <Skeleton width={150} height={24} />
      </View>
      <View style={styles.horizontalScroll}>
        <Skeleton width={260} height={100} style={{ borderRadius: radius.lg, marginLeft: spacing[5] }} />
        <Skeleton width={260} height={100} style={{ borderRadius: radius.lg, marginLeft: spacing[4] }} />
      </View>

      {/* Active Squads Section */}
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
  joinBarContainer: {
    paddingHorizontal: spacing[5],
    marginTop: spacing[4],
    marginBottom: spacing[6],
  },
  sectionHeader: {
    paddingHorizontal: spacing[5],
    marginTop: spacing[6],
    marginBottom: spacing[3],
  },
  horizontalScroll: {
    flexDirection: 'row',
    marginBottom: spacing[4],
  },
  cardGapContainer: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
});
