import { StyleSheet } from 'react-native';
import { fonts, radius, spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  pillWrapper: {
    height: 36,
    flex: 1,
  },
  pill: {
    flex: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
  },
});
