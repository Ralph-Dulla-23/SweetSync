import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 24,
    ...globalStyles.row,
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.peachPunch,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.peachPunch,
  },
  indigo: {
    backgroundColor: colors.indigoPunch,
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  disabled: {
    backgroundColor: colors.textTertiary,
    borderColor: colors.textTertiary,
  },
  text: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    textAlign: 'center',
  },
  textPrimary: {
    color: colors.white,
  },
  textSecondary: {
    color: colors.peachPunch,
  },
  textIndigo: {
    color: colors.white,
  },
  textGhost: {
    color: colors.textSecondary,
  },
  textDisabled: {
    color: colors.white,
  },
  iconContainer: {
    marginRight: spacing[2],
  },
});
