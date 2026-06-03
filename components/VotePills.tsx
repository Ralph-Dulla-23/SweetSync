import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { colors } from '@/constants/theme';
import { springConfigs } from '@/constants/animation';

import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withTiming, 
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { styles } from './VotePills.styles';

// Optional Haptics
let Haptics: any;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  Haptics = null;
}

const AnimatedCount = React.memo(({ count, color }: { count: number; color: string }) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withSpring(1, springConfigs.snappy)
    );
  }, [count]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ height: 20, justifyContent: 'center' }}>
      <Animated.Text
        style={[styles.text, animatedStyle, { color, marginLeft: 4 }]}
      >
        ({count})
      </Animated.Text>
    </View>
  );
});

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
    <Pressable
      onPress={handlePress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.pillWrapper,
        pressed && !(!onPress) && { opacity: 0.7 }
      ]}
    >
      <Animated.View
        style={[
          styles.pill,
          animatedStyle,
          { 
            backgroundColor: background, 
            borderColor: border,
            borderWidth: selected ? 2 : 1,
            opacity: selected ? 1 : 0.6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={`${label} ${count !== undefined ? `(${count} votes)` : ''}`}
      >
        <Text style={[styles.text, { color: text }]}>{label}</Text>
        {count !== undefined && <AnimatedCount count={count} color={text} />}
      </Animated.View>
    </Pressable>
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
            opacity: 0.6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }
        ]}
      >
        <Text style={[styles.text, { color: text }]}>{label}</Text>
        {count !== undefined && <AnimatedCount count={count} color={text} />}
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
