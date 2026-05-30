import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Card } from './Card';
import { styles } from './ActivityCard.styles';
import { Sparkle } from 'phosphor-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';

interface ActivityCardProps {
  title: string;
  votes: number;
  selected?: boolean;
  isAI?: boolean;
  onPress?: () => void;
}

export const ActivityCard = React.memo(({ title, votes, selected, isAI, onPress }: ActivityCardProps) => {
  const containerStyles = StyleSheet.flatten([
    styles.container,
    isAI && !selected && styles.aiContainer,
    selected && styles.selectedContainer,
  ]);

  return (
    <Card 
      variant={selected ? 'peach' : 'neutral'} 
      style={containerStyles} 
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <View style={styles.textSide}>
          <Text style={[styles.title, selected && styles.selectedTitle]}>{title}</Text>
          {isAI && (
            <View style={styles.aiBadgeInline}>
              <Sparkle 
                size={10} 
                color={selected ? colors.peachDeep : colors.indigoPunch} 
                weight="fill" 
              />
              <Text style={[
                styles.aiTextInline, 
                selected && { color: colors.peachDeep }
              ]}>
                MAGIC SUGGESTION
              </Text>
            </View>
          )}
        </View>
        
        <View style={[styles.voteBadge, selected && styles.selectedVoteBadge]}>
          <Text style={[styles.voteText, selected && styles.selectedVoteText]}>
            {votes} {votes === 1 ? 'vote' : 'votes'}
          </Text>
        </View>
      </View>
    </Card>
  );
});
