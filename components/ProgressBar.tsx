import React, { useEffect } from 'react';
import { View } from 'react-native';
import { colors } from '@/constants/theme';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { springConfigs } from '@/constants/animation';
import { styles } from './ProgressBar.styles';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  color?: string;
  backgroundColor?: string;
}

export const ProgressBar = React.memo(({ 
  progress, 
  height = 4, 
  color = colors.peachPunch,
  backgroundColor = 'rgba(0,0,0,0.07)'
}: ProgressBarProps) => {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withSpring(progress, springConfigs.elegant);
  }, [progress, animatedProgress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -50 }, // Move to center for scaling
      { scaleX: Math.max(0.0001, animatedProgress.value / 100) },
      { translateX: 50 }  // Move back to left-aligned origin
    ],
  }));

  return (
    <View 
      style={[styles.container, { height, backgroundColor, overflow: 'hidden' }]}
      accessibilityRole="progressbar"
      accessibilityLabel="Sync progress"
      accessibilityValue={{ min: 0, max: 100, now: progress }}
    >
      <Animated.View 
        style={[
          styles.fill, 
          { backgroundColor: color, width: '100%' }, // Fill the container width
          animatedStyle
        ]} 
      />
    </View>
  );
});

