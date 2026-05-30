import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing[10],
    gap: spacing[3],
  },
  iconCircle: {
    ...globalStyles.iconCircle,
    backgroundColor: colors.peachBase,
    borderColor: colors.peachSoft,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.textPrimary,
  },
  heroSubtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing[4],
  },
  form: {
    width: '100%',
    gap: spacing[4],
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    height: 80,
    ...globalStyles.center,
  },
  inputError: {
    borderColor: '#F09595',
    backgroundColor: '#FFF1F1',
  },
  input: {
    fontFamily: fonts.display,
    fontSize: 48,
    color: colors.textPrimary,
    textAlign: 'center',
    width: '100%',
    letterSpacing: 8,
  },
  errorText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.peachPunch,
    textAlign: 'center',
  },
  joinButton: {
    height: 56,
    marginTop: spacing[4],
  },
  privacyNote: {
    ...globalStyles.row,
    marginTop: 'auto',
    marginBottom: spacing[10],
    gap: spacing[2],
    paddingHorizontal: spacing[6],
  },
  privacyText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
