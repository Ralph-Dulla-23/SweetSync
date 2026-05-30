import { StyleSheet } from 'react-native';
import { fonts, radius, spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    letterSpacing: 0.02 * 11,
  },
});
