import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Skeleton } from './Skeleton';
import { Card } from './Card';
import { spacing } from '@/constants/theme';

export const VoteCardSkeleton = () => {
  return (
    <View style={styles.voteCard}>
      <View style={styles.cardLeft}>
        <Skeleton width={52} height={52} circle />
        <View style={styles.info}>
          <Skeleton width={120} height={20} style={styles.margin} />
          <Skeleton width={100} height={14} style={styles.margin} />
          <Skeleton width={80} height={12} />
        </View>
      </View>
      
      <View style={styles.cardRight}>
        <View style={styles.avatarRow}>
          <Skeleton width={24} height={24} circle style={styles.avatar} />
          <Skeleton width={24} height={24} circle style={styles.avatar} />
        </View>
        <Skeleton width={60} height={28} style={{ borderRadius: 8 }} />
      </View>
    </View>
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
    gap: spacing[4],
  },
  voteCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing[4],
    minHeight: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F5C4B3', // colors.peachSoft
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  info: {
    gap: 4,
  },
  margin: {
    marginBottom: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing[3],
  },
  avatarRow: {
    flexDirection: 'row',
  },
  avatar: {
    marginRight: -8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  }
});
