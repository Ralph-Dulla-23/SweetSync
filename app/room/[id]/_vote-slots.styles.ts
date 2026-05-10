import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  content: {
    ...globalStyles.scrollContent,
    paddingBottom: 100,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing[8],
    gap: spacing[3],
  },
  iconCircle: {
    ...globalStyles.iconCircle,
    backgroundColor: colors.indigoBase,
    borderColor: colors.indigoSoft,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing[4],
  },
  slotList: {
    gap: spacing[4],
  },
  slotContainer: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
    overflow: 'hidden',
  },
  voteArea: {
    padding: spacing[4],
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderTopWidth: 0.5,
    borderTopColor: colors.borderDefault,
  },
  infoBox: {
    ...globalStyles.row,
    backgroundColor: colors.peachBase,
    padding: spacing[4],
    borderRadius: radius.md,
    marginTop: spacing[8],
    gap: spacing[3],
    borderWidth: 0.5,
    borderColor: colors.peachSoft,
  },
  infoText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.peachDeep,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing[5],
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
  },
});
