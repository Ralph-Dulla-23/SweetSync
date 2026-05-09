import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '@/constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
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
  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <View 
        style={[
          styles.fill, 
          { 
            width: `${progress * 100}%`, 
            backgroundColor: color 
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
