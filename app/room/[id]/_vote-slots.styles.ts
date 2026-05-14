import { StyleSheet, Platform } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  content: {
    ...globalStyles.scrollContent,
    paddingBottom: 140,
    paddingTop: spacing[4],
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[8],
    gap: spacing[4],
    paddingHorizontal: 4,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    ...globalStyles.center,
    backgroundColor: colors.indigoBase,
    borderWidth: 1,
    borderColor: colors.indigoSoft,
  },
  heroTextContainer: {
    flex: 1,
    gap: 2,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.textPrimary,
  },
  heroSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  slotList: {
    gap: spacing[4],
  },
  slotContainer: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.indigoSoft,
    overflow: 'hidden',
  },
  voteArea: {
    padding: spacing[4],
    backgroundColor: colors.indigoBase + '40', // Very transparent indigo
    borderTopWidth: 1,
    borderTopColor: colors.indigoSoft,
  },
  infoBox: {
    ...globalStyles.row,
    backgroundColor: colors.peachBase,
    padding: spacing[5],
    borderRadius: radius.xl,
    marginTop: spacing[10],
    gap: spacing[4],
    borderWidth: 1,
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
    paddingBottom: Platform.OS === 'ios' ? spacing[10] : spacing[5],
  },
});
