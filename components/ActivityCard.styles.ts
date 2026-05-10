import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: {
    ...globalStyles.rowBetween,
    padding: spacing[4],
  },
  title: {
    fontFamily: fonts.bodySemibold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  voteBadge: {
    backgroundColor: colors.indigoBase,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
  },
  voteText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.indigoPunch,
  },
});
