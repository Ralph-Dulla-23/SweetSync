import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.pageBg,
    ...globalStyles.center,
  },
  loadingBrand: {
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.textPrimary,
  },
  container: {
    ...globalStyles.screen,
    backgroundColor: colors.peachBase,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    marginTop: 16,
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.textPrimary,
  },
  tagline: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
  },
  featureList: {
    gap: 32,
    marginBottom: 64,
  },
  featureItem: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    ...globalStyles.center,
  },
  featureText: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 17,
    color: colors.textPrimary,
  },
  featureDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    gap: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  button: {
    width: '100%',
    height: 54,
    backgroundColor: colors.peachPunch,
    borderRadius: 12,
  },
  signInLink: {
    paddingVertical: 8,
  },
  signInText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  signInTextBold: {
    fontFamily: fonts.bodySemibold,
    color: colors.indigoPunch,
  },
});
