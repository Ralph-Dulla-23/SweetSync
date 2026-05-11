import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Skeleton } from './Skeleton';
import { spacing, colors } from '@/constants/theme';

export const ProfileSkeleton = () => {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* User Card */}
      <View style={styles.userCard}>
        <Skeleton width={64} height={64} circle />
        <View style={styles.userInfo}>
          <Skeleton width={120} height={20} style={styles.margin} />
          <Skeleton width={180} height={14} />
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Skeleton width={30} height={24} style={styles.margin} />
          <Skeleton width={50} height={12} />
        </View>
        <View style={[styles.statBox, styles.statDivider]}>
          <Skeleton width={30} height={24} style={styles.margin} />
          <Skeleton width={50} height={12} />
        </View>
        <View style={styles.statBox}>
          <Skeleton width={30} height={24} style={styles.margin} />
          <Skeleton width={50} height={12} />
        </View>
      </View>

      {/* Sections */}
      {[1, 2].map((i) => (
        <View key={i} style={styles.section}>
          <Skeleton width={100} height={12} style={styles.sectionLabel} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Skeleton width={22} height={22} style={styles.icon} />
              <Skeleton width={140} height={16} />
            </View>
            <Skeleton width={16} height={16} />
          </View>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Skeleton width={22} height={22} style={styles.icon} />
              <Skeleton width={120} height={16} />
            </View>
            <Skeleton width={16} height={16} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing[5],
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  userInfo: {
    marginLeft: spacing[4],
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[6],
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.borderDefault,
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionLabel: {
    marginBottom: spacing[3],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderDefault,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing[3],
    borderRadius: 6,
  },
  margin: {
    marginBottom: 4,
  }
});
