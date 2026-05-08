import { Easing } from 'react-native-reanimated';

export const transitions = {
  cardEntrance: {
    duration: 280,
    easing: Easing.out(Easing.cubic),
  },
  buttonPress: {
    duration: 120,
    easing: Easing.in(Easing.cubic),
  },
  screenPush: {
    duration: 320,
    easing: Easing.inOut(Easing.cubic),
  },
  confirmedPop: {
    duration: 400,
    damping: 14,
    stiffness: 180,
  },
  listStaggerDelay: 50,
} as const;
