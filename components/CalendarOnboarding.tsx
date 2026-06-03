import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Pressable, 
  Dimensions,
  SafeAreaView,
  Platform
} from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Sparkle, Users, CalendarBlank, CaretRight, Check } from 'phosphor-react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeOut,
  SlideInRight,
  SlideOutLeft
} from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get('window');

// Safe storage wrapper for Web support
const getStorageItem = async (key: string) => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch (e) {
    return null;
  }
};

const setStorageItem = async (key: string, value: string) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch (e) {
    // Fail silently
  }
};

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  illustration: React.ReactNode;
}

const ONBOARDING_KEY = 'sweetsync_calendar_onboarding_seen';

export const CalendarOnboarding = ({ 
  onComplete, 
  forceShow = false 
}: { 
  onComplete: () => void;
  forceShow?: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  React.useEffect(() => {
    if (forceShow) {
      setVisible(true);
      setCurrentStep(0); // Reset to first step
    } else {
      checkStatus();
    }
  }, [forceShow]);

  const checkStatus = async () => {
    const seen = await getStorageItem(ONBOARDING_KEY);
    if (!seen) {
      setVisible(true);
    }
  };

  const handleComplete = async () => {
    await setStorageItem(ONBOARDING_KEY, 'true');
    setVisible(false);
    onComplete();
  };

  const steps: Step[] = [
    {
      id: 'heatmap',
      title: 'Reading the HeatMap',
      description: 'The darker the indigo, the more people are free! Aim for the darkest spots to unblock the squad.',
      icon: <Users size={24} color={colors.indigoPunch} weight="fill" />,
      illustration: (
        <View style={styles.gridIllustration}>
          <View style={[styles.cell, { backgroundColor: colors.indigoBase }]} />
          <View style={[styles.cell, { backgroundColor: colors.indigoSoft }]} />
          <View style={[styles.cell, { backgroundColor: colors.indigoMid }]} />
          <View style={[styles.cell, { backgroundColor: colors.indigoPunch, borderWidth: 2, borderColor: colors.indigoNeon }]} />
        </View>
      )
    },
    {
      id: 'magic',
      title: 'AI Magic Slots',
      description: 'Cells with a peach ring are "Magic Slots"—AI found windows where almost everyone is free.',
      icon: <Sparkle size={24} color={colors.peachPunch} weight="fill" />,
      illustration: (
        <View style={styles.magicIllustration}>
          <View style={[styles.cell, { backgroundColor: colors.indigoPunch, borderColor: colors.peachPunch, borderWidth: 2 }]}>
            <Sparkle size={20} color={colors.peachPunch} weight="fill" />
          </View>
        </View>
      )
    },
    {
      id: 'toggle',
      title: 'Switch Views',
      description: 'Toggle between "Group View" to see the squad and "My Schedule" to block your own busy times.',
      icon: <CalendarBlank size={24} color={colors.indigoPunch} weight="fill" />,
      illustration: (
        <View style={styles.toggleIllustration}>
          <View style={styles.tabBar}>
            <View style={styles.activeTab}><Text style={styles.tabText}>Group</Text></View>
            <View style={styles.inactiveTab}><Text style={styles.tabText}>Mine</Text></View>
          </View>
        </View>
      )
    }
  ];

  const step = steps[currentStep];

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View 
          entering={FadeInDown.duration(400)} 
          style={styles.container}
        >
          {/* Header Actions */}
          <View style={styles.topActions}>
            <Pressable 
              onPress={handleComplete}
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.skipLink}>Skip</Text>
            </Pressable>
          </View>

          <View style={styles.contentWrapper}>
            <Animated.View 
              key={currentStep} 
              entering={FadeIn.duration(300)} 
              exiting={FadeOut.duration(200)}
              style={styles.stepContent}
            >
              <View style={styles.iconCircle}>
                {step.icon}
              </View>
              
              <Text style={styles.title}>{step.title}</Text>

              <View style={styles.illustrationContainer}>
                {step.illustration}
              </View>

              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>{step.description}</Text>
              </View>
            </Animated.View>
          </View>

          <View style={styles.footer}>
            <View style={styles.dots}>
              {steps.map((_, i) => (
                <View 
                  key={i} 
                  style={[styles.dot, i === currentStep && styles.activeDot]} 
                />
              ))}
            </View>

            <Pressable 
              style={styles.nextButton}
              activeOpacity={0.8}
              onPress={() => {
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  handleComplete();
                }
              }}
            >
              <Text style={styles.nextText}>
                {currentStep === steps.length - 1 ? 'Got it!' : 'Next'}
              </Text>
              {currentStep === steps.length - 1 ? (
                <Check size={20} color={colors.white} weight="bold" />
              ) : (
                <CaretRight size={20} color={colors.white} weight="bold" />
              )}
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing[6],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing[2],
  },
  skipLink: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.textTertiary,
    padding: 4,
  },
  contentWrapper: {
    minHeight: 340, // Fixed height to prevent layout jumps/clipping
    justifyContent: 'center',
  },
  stepContent: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.indigoBase,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  illustrationContainer: {
    height: 120,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  descriptionContainer: {
    width: '100%',
    paddingHorizontal: spacing[2],
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  gridIllustration: {
    flexDirection: 'row',
    gap: 10,
  },
  cell: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
  },
  magicIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIllustration: {
    width: 220,
    padding: 12,
    backgroundColor: colors.pageBg,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 6,
  },
  activeTab: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderRadius: radius.full,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inactiveTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[8],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.pageBg,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderDefault,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.indigoPunch,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.indigoPunch,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: radius.full,
    gap: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  nextText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 16,
    color: colors.white,
  }
});

