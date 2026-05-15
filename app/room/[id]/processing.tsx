import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, fonts, spacing } from '@/constants/theme';
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
  cancelAnimation,
  Layout,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { styles } from './_processing.styles';

// Optional Haptics
let Haptics: any;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  Haptics = null;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Particle = ({ index }: { index: number }) => {
  const x = useSharedValue(Math.random() * SCREEN_WIDTH);
  const y = useSharedValue(Math.random() * SCREEN_HEIGHT);
  const scale = useSharedValue(Math.random() * 0.5 + 0.5);
  const opacity = useSharedValue(Math.random() * 0.3 + 0.2);

  useEffect(() => {
    x.value = withRepeat(withTiming(x.value + (Math.random() - 0.5) * 100, { duration: 3000 + Math.random() * 2000 }), -1, true);
    y.value = withRepeat(withTiming(y.value + (Math.random() - 0.5) * 100, { duration: 3000 + Math.random() * 2000 }), -1, true);
    opacity.value = withRepeat(withTiming(0.1, { duration: 2000 + Math.random() * 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { scale: scale.value }],
    opacity: opacity.value,
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: index % 2 === 0 ? colors.indigoSoft : colors.peachSoft,
  }));

  return <Animated.View style={animatedStyle} />;
};

const PulseRing = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(withTiming(2.2, { duration: 2000, easing: Easing.out(Easing.quad) }), -1, false);
    opacity.value = withRepeat(withTiming(0, { duration: 2000, easing: Easing.out(Easing.quad) }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.pulseRing, animatedStyle]} />;
};

const StatusRow = ({ label, status, index }: { label: string; status: 'done' | 'loading' | 'pending'; index: number }) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(status === 'done' ? 1 : 0.8);

  useEffect(() => {
    if (status === 'loading') {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1200, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        -1,
        false
      );
    } else if (status === 'done') {
      cancelAnimation(rotation);
      rotation.value = 0;
      scale.value = withSequence(
        withTiming(1.3, { duration: 200 }),
        withTiming(1, { duration: 300, easing: Easing.out(Easing.back(1.5)) })
      );
    }
  }, [status]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  return (
    <Animated.View 
      entering={FadeInDown.delay(400 + index * 150).duration(800).springify().damping(15)}
      layout={Layout.springify()}
      style={styles.statusRow}
    >
      <View style={[
        styles.statusIcon, 
        { backgroundColor: status === 'done' ? colors.mintBase : colors.indigoBase },
        status === 'pending' && { borderColor: colors.borderDefault, borderWidth: 1, backgroundColor: 'transparent' }
      ]}>
        {status === 'done' ? (
          <Animated.View style={animatedIconStyle}>
            <CheckCircle size={16} weight="fill" color={colors.mintPunch} />
          </Animated.View>
        ) : status === 'loading' ? (
          <Animated.View style={animatedIconStyle}>
            <CircleNotch size={16} color={colors.indigoPunch} weight="bold" />
          </Animated.View>
        ) : (
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textTertiary }} />
        )}
      </View>
      <Text style={[
        styles.statusText, 
        status === 'pending' && styles.statusTextPending,
        status === 'done' && { color: colors.textPrimary, fontFamily: fonts.bodySemibold }
      ]}>
        {label}
      </Text>
    </Animated.View>
  );
};

const STAGES = [
  "Gathering squad schedules...",
  "Searching for hidden windows...",
  "Ranking best overlap spots...",
  "AI generating fun ideas...",
];

export default function AIProcessingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const progress = useSharedValue(0);
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    // Progress bar animation (5.5 seconds total)
    progress.value = withTiming(1, { duration: 5500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    
    // Stage transition logic with haptics
    const transitionPoints = [1200, 2400, 3600, 4800];
    const timers: any[] = [];

    transitionPoints.forEach((time, index) => {
      timers.push(setTimeout(() => {
        setCurrentStage(index + 1);
        if (Haptics) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }, time));
    });

    const finalTimeout = setTimeout(() => {
      if (Haptics) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.replace(`/room/${id}/vote-slots`);
    }, 5800);

    return () => {
      timers.forEach(t => clearTimeout(t));
      clearTimeout(finalTimeout);
    };
  }, [id]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      {/* Background Magic Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Particle key={i} index={i} />
      ))}

      <View style={styles.centerCluster}>
        <View style={styles.pulseContainer}>
          <PulseRing />
          <Animated.View entering={FadeIn.duration(1000)}>
            <Sparkle size={56} color={colors.indigoPunch} weight="fill" />
          </Animated.View>
        </View>
        
        <Animated.View entering={FadeInDown.delay(200).duration(800).springify()}>
          <Text style={styles.headline}>Finding your{'\n'}free time...</Text>
          <Text style={styles.subtitle}>Our AI is weaving its magic 🪄</Text>
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
