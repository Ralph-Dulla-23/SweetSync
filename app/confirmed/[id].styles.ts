import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  content: globalStyles.scrollContent,
  ticketCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    ...globalStyles.shadowSm,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  ticketHeader: {
    ...globalStyles.rowBetween,
    marginBottom: spacing[4],
  },
  roomBadge: {
    backgroundColor: colors.peachBase,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  roomBadgeText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    color: colors.peachDeep,
    textTransform: 'uppercase',
  },
  statusBadge: {
    ...globalStyles.row,
    gap: 4,
  },
  statusText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    color: colors.mintPunch,
    letterSpacing: 1,
  },
  eventTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: spacing[8],
  },
  details: {
    gap: spacing[6],
  },
  detailRow: {
    ...globalStyles.row,
    gap: spacing[4],
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.peachBase,
    ...globalStyles.center,
  },
  detailValue: {
    fontFamily: fonts.bodySemibold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  detailLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  avatarRow: {
    marginTop: 6,
  },
  ticketDivider: {
    ...globalStyles.row,
    marginVertical: spacing[8],
    marginHorizontal: -spacing[6],
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.pageBg,
    marginHorizontal: -10,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  dashLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: 1,
  },
  qrSection: {
    alignItems: 'center',
    gap: spacing[2],
  },
  qrNote: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  actions: {
    marginTop: spacing[8],
    gap: spacing[4],
  },
  actionButton: {
    height: 56,
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  cancelLinkText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.peachPunch,
  },
});
