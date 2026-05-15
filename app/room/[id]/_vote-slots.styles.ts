import { StyleSheet, Platform } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  content: {
    ...globalStyles.scrollContent,
    paddingBottom: 120,
    paddingTop: spacing[4],
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
  heroTextContainer: {
    gap: spacing[1],
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
    gap: spacing[3],
  },
  slotContainer: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.indigoSoft,
    overflow: 'hidden',
    ...globalStyles.shadowSm,
  },
  voteArea: {
    padding: spacing[4],
    backgroundColor: colors.pageBg,
    borderTopWidth: 1,
    borderTopColor: colors.indigoSoft,
  },
  infoBox: {
    ...globalStyles.row,
    paddingTop: spacing[6],
    paddingBottom: spacing[2],
    paddingHorizontal: spacing[2],
    marginTop: spacing[6],
    gap: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.peachSoft,
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
    paddingBottom: Platform.OS === 'ios' ? spacing[10] : spacing[5],
  },
});
