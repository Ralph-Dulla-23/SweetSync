import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: {
    ...globalStyles.screen,
    backgroundColor: colors.peachBase,
  },
  header: {
    height: 60,
    paddingHorizontal: spacing[6],
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  skipText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.textTertiary,
  },
  stepContainer: {
    flex: 1,
  },
  illustrationArea: {
    flex: 0.5,
    ...globalStyles.center,
  },
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    ...globalStyles.center,
  },
  sparkleOverlay: {
    position: 'absolute',
    top: 30,
    right: 30,
  },
  contentArea: {
    flex: 0.5,
    paddingHorizontal: spacing[8],
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.textPrimary,
    lineHeight: 46,
  },
  titleAccent: {
    fontFamily: fonts.displayItalic,
    fontSize: 40,
    color: colors.peachPunch,
    lineHeight: 46,
    marginBottom: spacing[4],
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    height: 120,
    ...globalStyles.rowBetween,
    paddingHorizontal: spacing[8],
    paddingBottom: spacing[6],
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
    width: 60,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textTertiary,
  },
  activeDot: {
    width: 20,
  },
  nextButton: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    ...globalStyles.center,
  },
  nextButtonExpanded: {
    width: 160,
    borderRadius: radius.full,
  },
  nextButtonText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: colors.white,
    paddingHorizontal: 12,
  },
});
