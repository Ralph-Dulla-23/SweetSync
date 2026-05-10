import { StyleSheet } from 'react-native';
import { radius, spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 0.5,
    padding: spacing[4],
  },
});
