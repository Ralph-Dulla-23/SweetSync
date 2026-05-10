import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Skeleton } from './Skeleton';
import { spacing, radius, colors } from '@/constants/theme';
import { Header } from './Header';

export const RoomInteriorSkeleton = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header showBack backLabel="Rooms" title="" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress Card Skeleton */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Skeleton width={60} height={60} style={{ borderRadius: 12 }} />
            <View style={styles.progressInfo}>
              <Skeleton width="60%" height={24} style={{ marginBottom: 8 }} />
              <Skeleton width="40%" height={16} />
            </View>
          </View>
          <Skeleton height={10} style={{ borderRadius: 5 }} />
        </View>

        {/* Squad List Header */}
        <View style={styles.sectionHeader}>
          <Skeleton width={120} height={16} />
        </View>

        {/* Squad List Items */}
        <View style={styles.memberList}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.memberRow}>
              <View style={styles.memberLeft}>
                <Skeleton width={44} height={44} circle />
                <View style={styles.memberInfo}>
                  <Skeleton width={100} height={18} style={{ marginBottom: 4 }} />
                  <Skeleton width={140} height={14} />
                </View>
              </View>
              <Skeleton width={44} height={44} circle />
            </View>
          ))}
        </View>

        {/* Footer Button */}
        <View style={styles.footer}>
          <Skeleton height={60} style={{ borderRadius: radius.md }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  content: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
    paddingBottom: spacing[10],
  },
  progressSection: {
    marginBottom: spacing[10],
    padding: spacing[6],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.surface,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[5],
    marginBottom: spacing[6],
  },
  progressInfo: {
    flex: 1,
  },
  sectionHeader: {
    marginBottom: spacing[4],
    paddingHorizontal: 4,
  },
  memberList: {
    marginBottom: spacing[10],
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
    overflow: "hidden",
  },
  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[5],
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderDefault,
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
  },
  memberInfo: {
    gap: 3,
  },
  footer: {
    marginTop: "auto",
  },
});
