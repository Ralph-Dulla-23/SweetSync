import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  loadingContainer: globalStyles.center,
  content: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingBottom: spacing[8],
    flexGrow: 1,
  },
  progressSection: {
    marginBottom: spacing[8],
    padding: spacing[5],
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  peachCard: {
    backgroundColor: colors.peachBase,
    borderColor: colors.peachSoft,
  },
  mintCard: {
    backgroundColor: colors.mintBase,
    borderColor: colors.mintSoft,
  },
  progressHeader: {
    ...globalStyles.row,
    gap: spacing[4],
    marginBottom: spacing[5],
  },
  progressValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  progressMainValue: {
    fontFamily: fonts.display,
    fontSize: 42,
  },
  progressTotalValue: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textTertiary,
    marginLeft: 1,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  progressSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionHeader: {
    ...globalStyles.row,
    gap: spacing[2],
    marginBottom: spacing[3],
    marginTop: 0,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  memberList: {
    marginBottom: spacing[10],
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
    overflow: "hidden",
  },
  memberRow: {
    ...globalStyles.rowBetween,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[5],
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderDefault,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  memberLeft: {
    ...globalStyles.row,
    gap: spacing[4],
  },
  memberInfo: {
    gap: 3,
  },
  memberName: {
    fontFamily: fonts.bodySemibold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  statusRow: {
    ...globalStyles.row,
    gap: spacing[2],
  },
  hostTag: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.indigoPunch,
    backgroundColor: colors.indigoBase,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.sm,
    textTransform: "uppercase",
  },
  memberStatus: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  pendingText: {
    color: colors.peachPunch,
    fontFamily: fonts.bodySemibold,
  },
  statusIndicator: {
    width: 44,
    height: 44,
    ...globalStyles.center,
  },
  nudgeButton: {
    ...globalStyles.row,
    gap: spacing[1],
    paddingLeft: spacing[3],
    paddingRight: spacing[4],
    height: 44, // WCAG Minimum
    borderRadius: radius.full,
    backgroundColor: colors.peachBase,
    borderWidth: 0.5,
    borderColor: colors.peachSoft,
  },
  nudgeLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.peachPunch,
  },
  footer: {
    gap: spacing[3],
    alignItems: "center",
  },
  mainButton: {
    width: "100%",
    height: 60,
  },
  footerNote: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },
  // Nudge All Styles
  nudgeAllBanner: {
    backgroundColor: colors.peachBase,
    marginTop: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.peachSoft,
    padding: spacing[4],
    ...globalStyles.shadowSm,
  },
  nudgeAllContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  nudgeAllIcon: {
    width: 44, // WCAG Minimum
    height: 44, // WCAG Minimum
    borderRadius: radius.md,
    backgroundColor: colors.white,
    ...globalStyles.center,
    borderWidth: 1,
    borderColor: colors.peachSoft,
  },
  nudgeAllTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.peachPunch,
  },
  nudgeAllSubtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.peachDeep,
    opacity: 0.8,
  },
  nudgeAllButton: {
    backgroundColor: colors.peachPunch,
    paddingHorizontal: 16,
    height: 44, // WCAG Minimum
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  nudgeAllButtonText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    color: colors.white,
    letterSpacing: 0.5,
  },
  // Join Code Styles
  joinCodeContainer: {
    marginBottom: spacing[6],
  },
  joinCodeContent: {
    backgroundColor: colors.surface,
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  joinCodeLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.textTertiary,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  joinCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  joinCodeValue: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.indigoPunch,
    letterSpacing: 2,
  },
  copyButton: {
    width: 44,
    height: 44,
    ...globalStyles.center,
    backgroundColor: colors.peachBase,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.peachSoft,
  },
  leaveButton: {
    marginTop: spacing[10],
    paddingVertical: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveButtonText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.voteCantText,
  },
});
