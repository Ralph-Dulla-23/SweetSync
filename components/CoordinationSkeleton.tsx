import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Skeleton } from './Skeleton';
import { spacing, radius, colors } from '@/constants/theme';
import { Header } from './Header';

export const CoordinationSkeleton = ({ type = 'time' }: { type?: 'time' | 'activity' }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header showBack title="" subtitle="" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section Skeleton */}
        <View style={styles.hero}>
          <Skeleton width={64} height={64} circle />
          <View style={styles.heroTextContainer}>
            <Skeleton width="50%" height={24} style={{ marginBottom: 8 }} />
            <Skeleton width="80%" height={16} />
          </View>
        </View>

        {/* List Section Skeleton */}
        <View style={styles.list}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Skeleton width="40%" height={14} style={{ marginBottom: 8 }} />
                  <Skeleton width="70%" height={20} />
                </View>
                <Skeleton width={24} height={24} circle />
              </View>
              {type === 'time' && (
                <View style={styles.cardFooter}>
                  <Skeleton width="100%" height={8} style={{ borderRadius: 4 }} />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Footer Button Skeleton */}
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
    paddingTop: spacing[5],
    paddingBottom: spacing[10],
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    marginBottom: spacing[8],
  },
  heroTextContainer: {
    flex: 1,
  },
  list: {
    gap: spacing[4],
    marginBottom: spacing[10],
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[4],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardFooter: {
    marginTop: spacing[4],
  },
  footer: {
    marginTop: 'auto',
  },
});
