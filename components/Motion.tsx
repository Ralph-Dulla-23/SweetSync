import { withSpring } from 'react-native-reanimated';
import { springConfigs } from '@/constants/animation';

/**
 * NaturalTransition provides an Apple-style morphing effect for Shared Elements.
 * It uses spring physics for height, width, and position to ensure fluid momentum.
 */
export const NaturalTransition = {
  custom: (values: any) => {
    'worklet';
    return {
      height: withSpring(values.targetHeight, springConfigs.snappy),
      width: withSpring(values.targetWidth, springConfigs.snappy),
      originX: withSpring(values.targetOriginX, springConfigs.snappy),
      originY: withSpring(values.targetOriginY, springConfigs.snappy),
      borderRadius: withSpring(16, springConfigs.snappy),
    };
  }
} as any;
