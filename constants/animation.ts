import { Easing } from 'react-native-reanimated';

/**
 * Apple Fluid Interface Motion Tokens
 */
export const springConfigs = {
  // Snappy but gentle (Default Apple feel)
  snappy: {
    damping: 15,
    stiffness: 120,
    mass: 1,
  },
  // Bouncy and playful (Interactive feel)
  bouncy: {
    damping: 12,
    stiffness: 150,
    mass: 1,
  },
  // Soft and elegant (Subtle feel)
  elegant: {
    damping: 20,
    stiffness: 90,
    mass: 1,
  }
} as const;

export const transitions = {
  cardEntrance: {
    duration: 400,
    easing: Easing.bezier(0.23, 1, 0.32, 1), // Quintic-like curve
  },
  buttonPress: {
    duration: 150,
    easing: Easing.inOut(Easing.quad),
  },
  screenPush: {
    duration: 350,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
  listStaggerDelay: 50,
} as const;
