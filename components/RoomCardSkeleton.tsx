import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { Card } from './Card';
import { spacing } from '@/constants/theme';

export const RoomCardSkeleton = () => {
  return (
    <Card variant="peach" style={styles.container}>
      <View style={styles.top}>
        <Skeleton width={140} height={24} />
        <Skeleton width={80} height={24} />
      </View>
      <View style={styles.bottom}>
        <View style={styles.avatarRow}>
          <Skeleton width={22} height={22} circle style={styles.avatar} />
          <Skeleton width={22} height={22} circle style={styles.avatar} />
          <Skeleton width={22} height={22} circle style={styles.avatar} />
        </View>
        <Skeleton width={100} height={16} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 120,
    justifyContent: 'space-between',
    padding: spacing[5],
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[4],
  },
  avatarRow: {
    flexDirection: 'row',
  },
  avatar: {
    marginRight: -6,
    borderWidth: 2,
    borderColor: '#FFFFFF', // Matching AvatarStack look
  },
});
