import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  content: {
    ...globalStyles.scrollContent,
    paddingTop: spacing[6],
  },
  celebrationHeader: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.mintBase,
    ...globalStyles.center,
    marginBottom: spacing[4],
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing[1],
  },
  winnerCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.peachSoft,
    ...globalStyles.shadowMd,
  },
  winnerHeader: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  winnerLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.peachPunch,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  activityName: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.peachDeep,
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: 38,
  },
  detailsList: {
    gap: spacing[4],
    borderTopWidth: 1.5,
    borderTopColor: colors.peachBase,
    borderStyle: 'dashed',
    paddingTop: spacing[6],
  },
  detailItem: {
    ...globalStyles.row,
    gap: spacing[3],
  },
  detailText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  actions: {
    marginTop: spacing[10],
    gap: spacing[4],
  },
  actionButton: {
    height: 56,
  },
  shareContainer: {
    backgroundColor: colors.peachBase,
    borderRadius: radius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.peachSoft,
    ...globalStyles.rowBetween,
  },
  shareText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: colors.peachDeep,
  },
  backToRoom: {
    marginTop: spacing[10],
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  backToRoomText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
});
