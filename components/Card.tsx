import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/theme';
import { springConfigs } from '@/constants/animation';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';
import { styles } from './Card.styles';

export type CardVariant = 'peach' | 'indigo' | 'mint' | 'neutral';

const cardStyles: Record<CardVariant, { background: string; borderColor: string }> = {
  peach:   { background: colors.peachBase,  borderColor: colors.peachSoft  },
  indigo:  { background: colors.indigoPunch, borderColor: colors.indigoDeep },
  mint:    { background: colors.mintBase,   borderColor: colors.mintSoft   },
  neutral: { background: colors.pageBg,         borderColor: colors.borderDefault },
};

interface CardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  sharedTransitionTag?: string;
  sharedTransitionStyle?: any;
}

const AnimatedCard = React.memo(({ 
  variant, 
  children, 
  style, 
  onPress,
  sharedTransitionTag,
  sharedTransitionStyle 
}: CardProps) => {
  const { background, borderColor } = cardStyles[variant!];
  
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);

  const animatedPressStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleX: scaleX.value },
      { scaleY: scaleY.value }
    ],
  }));

  const handlePressIn = () => {
    scaleX.value = withTiming(1.02, { duration: 150 });
    scaleY.value = withTiming(0.98, { duration: 150 });
  };

  const handlePressOut = () => {
    scaleX.value = withSpring(1, springConfigs.snappy);
    scaleY.value = withSpring(1, springConfigs.snappy);
  };

  const AnimatedView = Animated.View as any;

  return (
    <TouchableOpacity 
      style={style}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <AnimatedView 
        sharedTransitionTag={sharedTransitionTag}
        sharedTransitionStyle={sharedTransitionStyle}
        style={[styles.card, { backgroundColor: background, borderColor }, animatedPressStyle]}
      >
        {children}
      </AnimatedView>
    </TouchableOpacity>
  );
});

export const Card = React.memo(({
  variant = 'neutral',
  children,
  style,
  onPress,
  sharedTransitionTag,
  sharedTransitionStyle,
}: CardProps) => {
  if (onPress || sharedTransitionTag) {
    return (
      <AnimatedCard 
        variant={variant}
        style={style}
        onPress={onPress}
        sharedTransitionTag={sharedTransitionTag}
        sharedTransitionStyle={sharedTransitionStyle}
      >
        {children}
      </AnimatedCard>
    );
  }

  const { background, borderColor } = cardStyles[variant];
  return (
    <View style={[styles.card, { backgroundColor: background, borderColor }, style]}>
      {children}
    </View>
  );
});

