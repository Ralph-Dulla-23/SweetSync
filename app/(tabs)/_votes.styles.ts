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
    padding: spacing[4],
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    minHeight: 100,
    gap: spacing[4],
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
  cardMainAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  quickVoteContainer: {
    backgroundColor: colors.pageBg,
    borderRadius: radius.md,
    padding: spacing[3],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[3],
  },
  quickVoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  quickVoteLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.peachPunch,
    letterSpacing: 1,
  },
  optionsList: {
    gap: spacing[3],
  },
  optionRow: {
    ...globalStyles.rowBetween,
    width: '100%',
    gap: spacing[4],
  },
  optionLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  activityInputContainer: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  inlineInput: {
    flex: 1,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    paddingHorizontal: spacing[3],
    fontFamily: fonts.body,
    fontSize: 14,
  },
  inlineSubmit: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.peachPunch,
    ...globalStyles.center,
  },
  fullViewButton: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.pageBg,
    ...globalStyles.center,
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
