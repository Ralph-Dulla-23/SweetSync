import React, { useEffect } from 'react';
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
  FadeInDown
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
  return (
    <Animated.View 
      entering={FadeInDown.delay(1000 + index * 400).duration(600)}
      style={styles.statusRow}
    >
      <View style={[
        styles.statusIcon, 
        { backgroundColor: status === 'done' ? colors.mintBase : colors.indigoBase }
      ]}>
        {status === 'done' ? (
          <CheckCircle size={16} weight="fill" color={colors.mintPunch} />
        ) : status === 'loading' ? (
          <Animated.View style={{ transform: [{ rotate: '45deg' }] }}>
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

export default function AIProcessingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 4000 });
    
    const timeout = setTimeout(() => {
      router.replace(`/room/${id}/vote-slots`);
    }, 5000);

    return () => clearTimeout(timeout);
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
          <Text style={styles.subtitle}>Cross-referencing the squad's schedules</Text>
        </Animated.View>

        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBarFill, progressBarStyle]} />
        </View>
      </View>

      <View style={styles.statusList}>
        <StatusRow label="Syncing group data..." status="done" index={0} />
        <StatusRow label="Identifying overlaps..." status="loading" index={1} />
        <StatusRow label="Optimizing activities..." status="pending" index={2} />
      </View>
    </View>
  );
}
