import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    gap: spacing[1],
  },
  time: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textPrimary,
  },
  stats: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
  },
});
