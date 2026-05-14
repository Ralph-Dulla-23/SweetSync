import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  content: {
    ...globalStyles.scrollContent,
    paddingTop: spacing[4],
  },
  list: {
    gap: spacing[4],
  },
  feedHeader: {
    ...globalStyles.row,
    gap: spacing[2],
    marginBottom: spacing[2],
    paddingHorizontal: 4,
  },
  feedTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.textTertiary,
    letterSpacing: 1,
  },
  voteCard: {
    ...globalStyles.rowBetween,
    padding: spacing[4],
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    minHeight: 100,
  },
  cardLeft: {
    ...globalStyles.row,
    gap: spacing[4],
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    ...globalStyles.center,
    borderWidth: 1,
  },
  info: {
    gap: 2,
    flex: 1,
  },
  voteType: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roomName: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  deadlineRow: {
    ...globalStyles.row,
    gap: 4,
    marginTop: 2,
  },
  deadline: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.peachPunch,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: spacing[3],
  },
  voteCTA: {
    ...globalStyles.row,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    gap: 4,
  },
  voteCTAText: {
    color: colors.white,
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    letterSpacing: 1,
  },
  // Batch Voting Styles
  expandedCard: {
    backgroundColor: '#FBFAFF',
    borderColor: colors.indigoPunch,
    borderWidth: 2,
  },
  cardMainAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  quickVoteIndicator: {
    ...globalStyles.row,
    backgroundColor: colors.peachBase,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    gap: 2,
    borderWidth: 1,
    borderColor: colors.peachSoft,
  },
  quickVoteText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.peachPunch,
  },
  expandedContent: {
    marginTop: spacing[4],
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderDefault,
    marginBottom: spacing[4],
  },
  optionsList: {
    gap: spacing[4],
  },
  optionRow: {
    ...globalStyles.rowBetween,
    width: '100%',
  },
  optionLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  activityInputContainer: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  inlineInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    paddingHorizontal: spacing[3],
    fontFamily: fonts.body,
  },
  inlineSubmit: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.peachPunch,
    ...globalStyles.center,
  },
  fullViewButton: {
    marginTop: spacing[6],
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  fullViewText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.indigoPunch,
    textDecorationLine: 'underline',
  },
  successCard: {
    ...globalStyles.row,
    padding: spacing[4],
    backgroundColor: colors.mintBase,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.mintSoft,
    minHeight: 100,
    gap: spacing[3],
  },
  successText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: colors.mintPunch,
  },
  emptyState: {
    flex: 1,
    marginTop: 100,
    ...globalStyles.center,
    gap: spacing[4],
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.textSecondary,
  },
  emptySubtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
