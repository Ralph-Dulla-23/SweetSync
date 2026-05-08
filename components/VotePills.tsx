import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors, fonts, radius, spacing } from '@/constants/theme';

export type VoteType = 'free' | 'prefer' | 'cant';

interface VotePillProps {
  type: VoteType;
  selected?: boolean;
  onPress?: () => void;
  count?: number;
}

const voteStyles: Record<VoteType, { background: string; border: string; text: string; label: string }> = {
  free: { 
    background: '#E1F5EE', 
    border: '#9FE1CB', 
    text: '#085041',
    label: 'Free'
  },
  prefer: { 
    background: '#EEEDFE', 
    border: '#AFA9EC', 
    text: '#3C3489',
    label: 'Prefer'
  },
  cant: { 
    background: '#FCEBEB', 
    border: '#F09595', 
    text: '#791F1F',
    label: "Can't"
  },
};

export function VotePill({ type, selected = false, onPress, count }: VotePillProps) {
  const { background, border, text, label } = voteStyles[type];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
      style={[
        styles.pill,
        { 
          backgroundColor: background, 
          borderColor: border,
          borderWidth: selected ? 2 : 1,
          opacity: selected ? 1 : 0.6
        }
      ]}
    >
      <Text style={[styles.text, { color: text }]}>
        {label} {count !== undefined && `(${count})`}
      </Text>
    </TouchableOpacity>
  );
}

export function VotePills({ 
  onVote, 
  selectedVote,
  counts 
}: { 
  onVote?: (type: VoteType) => void;
  selectedVote?: VoteType;
  counts?: Record<VoteType, number>;
}) {
  return (
    <View style={styles.container}>
      {(['free', 'prefer', 'cant'] as VoteType[]).map((type) => (
        <VotePill
          key={type}
          type={type}
          selected={selectedVote === type}
          onPress={onVote ? () => onVote(type) : undefined}
          count={counts?.[type]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  pill: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
  },
});
