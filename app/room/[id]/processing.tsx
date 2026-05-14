import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/theme';
import { Sparkle, CheckCircle, CircleNotch } from 'phosphor-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  withDelay,
  FadeIn,
  FadeInDown,
  Easing,
  cancelAnimation
} from 'react-native-reanimated';
import { styles } from './_processing.styles';

const PulseRing = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.8, { duration: 2000 }), -1, false);
    opacity.value = withRepeat(withTiming(0, { duration: 2000 }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.pulseRing, animatedStyle]} />;
};

const StatusRow = ({ label, status, index }: { label: string; status: 'done' | 'loading' | 'pending'; index: number }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (status === 'loading') {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
  }, [status]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View 
      entering={FadeInDown.delay(200 + index * 100).duration(600)}
      style={styles.statusRow}
    >
      <View style={[
        styles.statusIcon, 
        { backgroundColor: status === 'done' ? colors.mintBase : colors.indigoBase }
      ]}>
        {status === 'done' ? (
          <CheckCircle size={16} weight="fill" color={colors.mintPunch} />
        ) : status === 'loading' ? (
          <Animated.View style={animatedIconStyle}>
            <CircleNotch size={16} color={colors.indigoPunch} weight="bold" />
          </Animated.View>
        ) : (
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.indigoSoft }} />
        )}
      </View>
      <Text style={[styles.statusText, status === 'pending' && styles.statusTextPending]}>
        {label}
      </Text>
    </Animated.View>
  );
};

const STAGES = [
  "Processing schedule data...",
  "Identifying free time windows...",
  "Ranking optimal slots...",
  "Drafting activity suggestions...",
];

export default function AIProcessingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const progress = useSharedValue(0);
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    // Progress bar animation (5 seconds)
    progress.value = withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.quad) });
    
    // Stage transition logic
    const interval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev < STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    const timeout = setTimeout(() => {
      router.replace(`/room/${id}/vote-slots`);
    }, 5500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [id]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.centerCluster}>
        <View style={styles.pulseContainer}>
          <PulseRing />
          <Sparkle size={48} color={colors.indigoPunch} weight="fill" />
        </View>
        
        <Animated.View entering={FadeInDown.duration(800)}>
          <Text style={styles.headline}>Finding your{'\n'}free time...</Text>
          <Text style={styles.subtitle}>Our AI is weaving its magic</Text>
        </Animated.View>

        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBarFill, progressBarStyle]} />
        </View>
      </View>

      <View style={styles.statusList}>
        {STAGES.map((label, index) => {
          let status: 'done' | 'loading' | 'pending' = 'pending';
          if (index < currentStage) status = 'done';
          else if (index === currentStage) status = 'loading';
          
          return (
            <StatusRow 
              key={label}
              label={label} 
              status={status} 
              index={index} 
            />
          );
        })}
      </View>
    </View>
  );
}
