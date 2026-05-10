import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Card } from './Card';
import { styles } from './ActivityCard.styles';

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

