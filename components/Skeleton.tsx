import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Animated, DimensionValue } from 'react-native';
import { colors, radius } from '@/constants/theme';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  circle?: boolean;
  style?: ViewStyle;
}

export const Skeleton = ({ 
  width = '100%', 
  height = 20, 
  circle = false,
  style 
}: SkeletonProps) => {
  const opacity = new Animated.Value(0.3);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: circle ? (typeof height === 'number' ? height / 2 : radius.md) : radius.md,
          opacity,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.borderDefault,
  },
});
