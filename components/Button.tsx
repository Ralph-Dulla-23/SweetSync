import React from 'react';
import { 
  Pressable, 
  Text, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View
} from 'react-native';
import { colors } from '@/constants/theme';
import { springConfigs } from '@/constants/animation';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { styles } from './Button.styles';

export type ButtonVariant = 'primary' | 'secondary' | 'indigo' | 'ghost';

interface ButtonProps {
  onPress: () => void;
  title?: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  pulse?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = React.memo(({
  onPress,
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  pulse = false,
  style,
  textStyle,
  icon,
  children,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isIndigo = variant === 'indigo';
  const isGhost = variant === 'ghost';

  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    if (pulse && !disabled && !loading) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 600, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
    }
  }, [pulse, disabled, loading]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleX: scaleX.value * pulseScale.value },
      { scaleY: scaleY.value * pulseScale.value }
    ],
  }));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scaleX.value = withTiming(1.04, { duration: 120 });
      scaleY.value = withTiming(0.96, { duration: 120 });
    }
  };

  const handlePressOut = () => {
    scaleX.value = withSpring(1, springConfigs.bouncy);
    scaleY.value = withSpring(1, springConfigs.bouncy);
  };

  const buttonStyles = [
    styles.base,
    isPrimary && styles.primary,
    isSecondary && styles.secondary,
    isIndigo && styles.indigo,
    isGhost && styles.ghost,
    disabled && styles.disabled,
    style,
  ] as ViewStyle[];

  const titleStyles = [
    styles.text,
    isPrimary && styles.textPrimary,
    isSecondary && styles.textSecondary,
    isIndigo && styles.textIndigo,
    isGhost && styles.textGhost,
    disabled && styles.textDisabled,
    textStyle,
  ] as TextStyle[];

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[buttonStyles, animatedStyle]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary || isGhost ? colors.peachPunch : colors.white} />
      ) : (
        <>
          {icon && (
            <View style={[
              styles.iconContainer, 
              !title && { marginRight: 0 }
            ]}>
              {icon}
            </View>
          )}
          {title ? <Text style={titleStyles}>{title}</Text> : null}
          {children}
        </>
      )}
    </AnimatedPressable>
  );
});
