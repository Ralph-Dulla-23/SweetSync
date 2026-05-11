import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: {
    ...globalStyles.rowBetween,
    alignItems: "flex-start",
    paddingHorizontal: spacing[5],
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
    backgroundColor: colors.pageBg,
  },
  leftContainer: {
    flex: 1,
    gap: spacing[1],
  },
  rightContainer: {
    paddingTop: spacing[1],
    justifyContent: "flex-start",
  },
  backButton: {
    ...globalStyles.row,
    marginBottom: spacing[2],
    marginLeft: -4,
    paddingVertical: 8,
    paddingRight: 16,
  },
  backLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.peachPunch,
    marginLeft: 4,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.textPrimary,
    lineHeight: 34,
  },
});
