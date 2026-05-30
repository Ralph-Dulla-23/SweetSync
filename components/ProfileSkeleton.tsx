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
          <Skeleton width={120} height={22} style={styles.margin} />
          <Skeleton width={180} height={14} />
        </View>
      </View>

      {/* Sections */}
      {[1, 2].map((i) => (
        <View key={i} style={styles.section}>
          <Skeleton width={100} height={12} style={styles.sectionLabel} />
          <View style={styles.sectionCard}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Skeleton width={22} height={22} style={styles.icon} />
                <Skeleton width={140} height={16} />
              </View>
              <Skeleton width={16} height={16} />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Skeleton width={22} height={22} style={styles.icon} />
                <Skeleton width={120} height={16} />
              </View>
              <Skeleton width={16} height={16} />
            </View>
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
    paddingTop: spacing[6],
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[8],
    backgroundColor: '#FFFFFF',
    padding: spacing[5],
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F5C4B3', // peachSoft
  },
  userInfo: {
    marginLeft: spacing[4],
    flex: 1,
  },
  section: {
    marginBottom: spacing[8],
  },
  sectionLabel: {
    marginBottom: spacing[3],
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.borderDefault,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderDefault,
    marginHorizontal: spacing[4],
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
