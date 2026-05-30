import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { colors } from '@/constants/theme';
import { springConfigs } from '@/constants/animation';

import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withTiming, 
  withSpring,
  Easing 
} from 'react-native-reanimated';
import { styles } from './VotePills.styles';

// Optional Haptics
let Haptics: any;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  Haptics = null;
}

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

const AnimatedVotePill = React.memo(({ 
  background, 
  border, 
  text, 
  label, 
  selected, 
  onPress, 
  count 
}: any) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (selected) {
      scale.value = withSequence(
        withSpring(1.15, springConfigs.bouncy),
        withSpring(1, springConfigs.bouncy)
      );
    }
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (onPress) {
      if (Haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!onPress}
      activeOpacity={0.7}
      style={styles.pillWrapper}
    >
      <Animated.View
        style={[
          styles.pill,
          animatedStyle,
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
      </Animated.View>
    </TouchableOpacity>
  );
});

export const VotePill = React.memo(({ type, selected = false, onPress, count }: VotePillProps) => {
  const { background, border, text, label } = voteStyles[type];
  
  if (selected || !!onPress) {
    return (
      <AnimatedVotePill 
        background={background}
        border={border}
        text={text}
        label={label}
        selected={selected}
        onPress={onPress}
        count={count}
      />
    );
  }

  return (
    <View style={styles.pillWrapper}>
      <View
        style={[
          styles.pill,
          { 
            backgroundColor: background, 
            borderColor: border,
            borderWidth: 1,
            opacity: 0.6
          }
        ]}
      >
        <Text style={[styles.text, { color: text }]}>
          {label} {count !== undefined && `(${count})`}
        </Text>
      </View>
    </View>
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
