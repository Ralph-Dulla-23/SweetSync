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
    background: colors.voteFreeBg, 
    border: colors.voteFreeBorder, 
    text: colors.voteFreeText,
    label: 'Free'
  },
  prefer: { 
    background: colors.votePreferBg, 
    border: colors.votePreferBorder, 
    text: colors.votePreferText,
    label: 'Prefer'
  },
  cant: { 
    background: colors.voteCantBg, 
    border: colors.voteCantBorder, 
    text: colors.voteCantText,
    label: "Can't"
  },
};

export const VotePill = React.memo(({ type, selected = false, onPress, count }: VotePillProps) => {
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
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label} ${count !== undefined ? `(${count} votes)` : ''}`}
    >
      <Text style={[styles.text, { color: text }]}>
        {label} {count !== undefined && `(${count})`}
      </Text>
    </TouchableOpacity>
  );
});

export const VotePills = React.memo(({ 
  onVote, 
  selectedVote,
  counts 
}: { 
  onVote?: (type: VoteType) => void;
  selectedVote?: VoteType;
  counts?: Record<VoteType, number>;
}) => {
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
});

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
