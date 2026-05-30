import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  keyboardView: {
    flex: 1,
  },
  scrollContent: globalStyles.scrollContent,
  backButton: {
    marginTop: spacing[2],
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  header: {
    marginTop: spacing[6],
    alignItems: 'center',
  },
  logoContainer: {
    ...globalStyles.iconCircle,
    backgroundColor: colors.peachBase,
    marginBottom: spacing[4],
    borderColor: colors.peachSoft,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.textPrimary,
  },
  titleAccent: {
    fontFamily: fonts.displayItalic,
    fontSize: 28,
    color: colors.peachPunch,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing[2],
    paddingHorizontal: spacing[4],
  },
  form: {
    marginTop: spacing[8],
    gap: spacing[4],
  },
  errorContainer: {
    backgroundColor: '#FFF1F1',
    padding: spacing[3],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#F09595',
  },
  errorText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: '#791F1F',
    textAlign: 'center',
  },
  inputContainer: {
    ...globalStyles.row,
    backgroundColor: colors.peachBase,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.peachSoft,
    paddingHorizontal: spacing[4],
    height: 56,
  },
  inputError: {
    borderColor: '#F09595',
    backgroundColor: '#FFF1F1',
  },
  inputIcon: {
    marginRight: spacing[3],
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textPrimary,
  },
  authButton: {
    marginTop: spacing[2],
    height: 56,
  },
  divider: {
    ...globalStyles.row,
    marginVertical: spacing[4],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderDefault,
  },
  dividerText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: spacing[3],
  },
  googleButton: {
    height: 56,
    backgroundColor: colors.white,
    borderColor: colors.borderDefault,
  },
  googleButtonText: {
    color: colors.textPrimary,
  },
  magicLinkContainer: {
    marginTop: spacing[2],
    alignItems: 'center',
  },
  magicLinkText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  magicLinkAction: {
    fontFamily: fonts.bodySemibold,
    color: colors.indigoPunch,
  },
  toggleContainer: {
    marginTop: spacing[4],
    alignItems: 'center',
  },
  toggleText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  toggleAction: {
    fontFamily: fonts.bodySemibold,
    color: colors.peachPunch,
  },
  demoButton: {
    marginTop: spacing[4],
  },
  demoButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
