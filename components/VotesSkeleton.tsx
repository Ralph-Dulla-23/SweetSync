import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Skeleton } from './Skeleton';
import { Card } from './Card';
import { spacing } from '@/constants/theme';

export const VoteCardSkeleton = () => {
  return (
    <Card variant="peach" style={styles.voteCard}>
      <View style={styles.cardLeft}>
        <Skeleton width={40} height={40} circle />
        <View style={styles.info}>
          <Skeleton width={100} height={18} style={styles.margin} />
          <Skeleton width={140} height={14} style={styles.margin} />
          <Skeleton width={80} height={12} />
        </View>
      </View>
      
      <View style={styles.cardRight}>
        <View style={styles.avatarRow}>
          <Skeleton width={20} height={20} circle style={styles.avatar} />
          <Skeleton width={20} height={20} circle style={styles.avatar} />
        </View>
        <Skeleton width={16} height={16} />
      </View>
    </Card>
  );
};

export const VotesSkeleton = () => {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.list}>
        <VoteCardSkeleton />
        <VoteCardSkeleton />
        <VoteCardSkeleton />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: spacing[4],
  },
  list: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
  voteCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing[4],
    minHeight: 100,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  info: {
    gap: 4,
  },
  margin: {
    marginBottom: 2,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  avatarRow: {
    flexDirection: 'row',
  },
  avatar: {
    marginRight: -6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  }
});
