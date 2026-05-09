import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  FlatList, 
  NativeSyntheticEvent, 
  NativeScrollEvent,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Sparkle, 
  Scan, 
  CalendarBlank, 
  ListChecks, 
  CaretRight 
} from 'phosphor-react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import Animated, { 
  FadeIn, 
  FadeInRight 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  title: string;
  titleAccent: string;
  description: string;
  icon: any;
  iconColor: string;
  bgColors: [string, string];
}

const steps: OnboardingStep[] = [
  {
    id: '1',
    title: 'Upload &',
    titleAccent: 'Sync.',
    description: 'Upload a screenshot of your schedule. Our AI extracts your busy blocks automatically.',
    icon: Scan,
    iconColor: colors.peachPunch,
    bgColors: [colors.peachBase, colors.white],
  },
  {
    id: '2',
    title: 'Find the',
    titleAccent: 'Gaps.',
    description: 'See a collective heat map of when your group is free. No more "when are you free?" messages.',
    icon: CalendarBlank,
    iconColor: colors.indigoPunch,
    bgColors: [colors.indigoBase, colors.white],
  },
  {
    id: '3',
    title: 'Decide',
    titleAccent: 'Together.',
    description: 'Vote on time slots and AI-suggested activities. Confirm plans in seconds.',
    icon: ListChecks,
    iconColor: colors.mintPunch,
    bgColors: [colors.mintBase, colors.white],
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [activeIndex, setActivePage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    setActivePage(index);
  };

  const handleNext = () => {
    if (activeIndex < steps.length - 1) {
      const nextIndex = activeIndex + 1;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      setActivePage(nextIndex);
    } else {
      router.push({ pathname: '/(auth)/sign-in', params: { mode: 'signup' } });
    }
  };

  const renderStep = ({ item }: { item: OnboardingStep; index: number }) => (
    <View style={[styles.stepContainer, { width }]}>
      <View style={styles.illustrationArea}>
        <Animated.View 
          entering={FadeIn.delay(200).duration(1000)}
          style={[styles.iconCircle, { backgroundColor: item.iconColor + '15' }]}
        >
          <item.icon size={80} weight="duotone" color={item.iconColor} />
          <View style={styles.sparkleOverlay}>
            <Sparkle size={24} weight="fill" color={item.iconColor} />
          </View>
        </Animated.View>
      </View>

      <View style={styles.contentArea}>
        <Animated.View entering={FadeInRight.delay(300).duration(600)}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.titleAccent}>{item.titleAccent}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push('/(auth)/sign-in')}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={steps}
        renderItem={renderStep}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        keyExtractor={(item) => item.id}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index && styles.activeDot,
                activeIndex === index && { backgroundColor: steps[index].iconColor }
              ]}
            />
          ))}
        </View>

        <TouchableOpacity 
          onPress={handleNext}
          activeOpacity={0.8}
          style={[
            styles.nextButton,
            { backgroundColor: steps[activeIndex].iconColor },
            activeIndex === steps.length - 1 && styles.nextButtonExpanded
          ]}
        >
          {activeIndex === steps.length - 1 ? (
            <Animated.Text 
              entering={FadeIn.duration(400)} 
              style={styles.nextButtonText}
            >
              Get Started
            </Animated.Text>
          ) : (
            <CaretRight size={24} weight="bold" color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.peachBase,
  },
  header: {
    height: 60,
    paddingHorizontal: spacing[6],
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  skipText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.textTertiary,
  },
  stepContainer: {
    flex: 1,
  },
  illustrationArea: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkleOverlay: {
    position: 'absolute',
    top: 30,
    right: 30,
  },
  contentArea: {
    flex: 0.5,
    paddingHorizontal: spacing[8],
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.textPrimary,
    lineHeight: 46,
  },
  titleAccent: {
    fontFamily: fonts.displayItalic,
    fontSize: 40,
    color: colors.peachPunch,
    lineHeight: 46,
    marginBottom: spacing[4],
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[8],
    paddingBottom: spacing[6],
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
    width: 60,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textTertiary,
  },
  activeDot: {
    width: 20,
  },
  nextButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonExpanded: {
    width: 160,
    borderRadius: 32,
  },
  nextButtonText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: colors.white,
    paddingHorizontal: 12,
  },
});
