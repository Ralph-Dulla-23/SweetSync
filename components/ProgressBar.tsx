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

export function ProgressBar({ 
  progress, 
  height = 4, 
  color = colors.peachPunch,
  backgroundColor = 'rgba(0,0,0,0.07)'
}: ProgressBarProps) {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withSpring(progress, springConfigs.elegant);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value}%`,
  }));

  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <Animated.View 
        style={[
          styles.fill, 
          { backgroundColor: color },
          animatedStyle
        ]} 
      />
    </View>
  );
}
