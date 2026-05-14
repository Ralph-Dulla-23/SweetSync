import { StyleSheet } from 'react-native';
import { radius, spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    // Border weight should be driven by variant or style override
    padding: spacing[4],
  },
});
