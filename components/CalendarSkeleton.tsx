import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Skeleton } from './Skeleton';
import { spacing, radius, colors } from '@/constants/theme';
import { Header } from './Header';

export const CalendarSkeleton = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Availability" 
        subtitle=" " 
        showBack 
        backLabel="Room" 
      />

      {/* Tabs Skeleton */}
      <View style={styles.tabContainer}>
        <Skeleton width={100} height={36} style={{ borderRadius: 18 }} />
        <Skeleton width={110} height={36} style={{ borderRadius: 18 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner Skeleton */}
        <View style={styles.bannerContainer}>
          <Skeleton height={60} style={{ borderRadius: radius.md }} />
        </View>

        {/* HeatMap Skeleton */}
        <View style={styles.heatmapContainer}>
          <View style={styles.daysHeader}>
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} width={40} height={20} />
            ))}
          </View>
          <View style={styles.grid}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(row => (
              <View key={row} style={styles.gridRow}>
                {[1, 2, 3, 4, 5].map(col => (
                  <Skeleton key={col} width={50} height={50} style={styles.gridCell} />
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Legend Skeleton */}
        <View style={styles.legendContainer}>
          <Skeleton width={200} height={20} />
        </View>
      </ScrollView>

      {/* Bottom Sheet Peek Skeleton */}
      <View style={styles.bottomSheetPeek}>
        <View style={styles.dragHandle} />
        <Skeleton width="80%" height={24} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    gap: spacing[2],
  },
  scrollContent: {
    paddingBottom: 160,
  },
  bannerContainer: {
    paddingHorizontal: spacing[5],
    marginBottom: spacing[4],
  },
  heatmapContainer: {
    paddingHorizontal: spacing[5],
    alignItems: 'center',
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingLeft: 40,
    marginBottom: spacing[2],
  },
  grid: {
    width: '100%',
    paddingLeft: 40,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  gridCell: {
    borderRadius: 4,
  },
  legendContainer: {
    marginTop: spacing[8],
    alignItems: "center",
  },
  bottomSheetPeek: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    alignItems: "center",
    paddingTop: 12,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderDefault,
    marginBottom: 16,
  },
});
