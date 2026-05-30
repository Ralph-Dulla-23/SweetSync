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

const cardStyles: Record<CardVariant, { background: string; borderColor: string; borderWidth: number }> = {
  peach:   { background: colors.peachBase,  borderColor: colors.peachSoft,    borderWidth: 2 },
  indigo:  { background: colors.indigoPunch, borderColor: colors.indigoDeep,    borderWidth: 2 },
  mint:    { background: colors.mintBase,   borderColor: colors.mintSoft,      borderWidth: 2 },
  neutral: { background: colors.white,      borderColor: colors.borderDefault, borderWidth: 2 },
};

interface CardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
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
  const { background, borderColor, borderWidth } = cardStyles[variant!];
  
  const scale = useSharedValue(1);

  const animatedPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfigs.snappy);
  };

  const AnimatedView = Animated.View as any;

  return (
    <TouchableOpacity 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <AnimatedView 
        sharedTransitionTag={sharedTransitionTag}
        sharedTransitionStyle={sharedTransitionStyle}
        style={[
          styles.card, 
          { backgroundColor: background, borderColor, borderWidth }, 
          style, 
          animatedPressStyle
        ]}
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

  const { background, borderColor, borderWidth } = cardStyles[variant];
  return (
    <View style={[styles.card, { backgroundColor: background, borderColor, borderWidth }, style]}>
      {children}
    </View>
  );
});

