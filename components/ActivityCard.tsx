import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Card } from './Card';

interface ActivityCardProps {
  title: string;
  votes: number;
  onPress?: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ title, votes, onPress }) => {
  return (
    <Card style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.voteBadge}>
        <Text style={styles.voteText}>{votes} votes</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.bodySemibold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  voteBadge: {
    backgroundColor: colors.indigoBase,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
  },
  voteText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.indigoPunch,
  },
});
