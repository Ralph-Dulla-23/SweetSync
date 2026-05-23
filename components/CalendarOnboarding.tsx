import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView
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

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  illustration: React.ReactNode;
}

const ONBOARDING_KEY = 'sweetsync_calendar_onboarding_seen';

export const CalendarOnboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  React.useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const seen = await SecureStore.getItemAsync(ONBOARDING_KEY);
    if (!seen) {
      setVisible(true);
    }
  };

  const handleComplete = async () => {
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
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
        <Animated.View entering={FadeInDown.duration(400)} style={styles.container}>
          <View style={styles.content}>
            <Animated.View 
              key={step.id} 
              entering={SlideInRight.duration(300)} 
              exiting={SlideOutLeft.duration(300)}
              style={styles.stepContent}
            >
              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  {step.icon}
                </View>
                <Text style={styles.title}>{step.title}</Text>
              </View>

              <View style={styles.illustrationContainer}>
                {step.illustration}
              </View>

              <Text style={styles.description}>{step.description}</Text>
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

            <TouchableOpacity 
              style={styles.nextButton}
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
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  container: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing[6],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  content: {
    minHeight: 280,
  },
  stepContent: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.indigoBase,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  illustrationContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[6],
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
    gap: 8,
  },
  cell: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
  },
  magicIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIllustration: {
    width: 200,
    padding: 10,
    backgroundColor: colors.pageBg,
    borderRadius: radius.full,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 4,
  },
  activeTab: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 8,
    borderRadius: radius.full,
    alignItems: 'center',
    ...colors.shadowSm,
  },
  inactiveTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[8],
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderDefault,
  },
  activeDot: {
    width: 20,
    backgroundColor: colors.indigoPunch,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.indigoPunch,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: radius.full,
    gap: 8,
  },
  nextText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: colors.white,
  }
});
