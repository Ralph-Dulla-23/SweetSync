import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  loadingContainer: globalStyles.center,
  content: {
    ...globalStyles.scrollContent,
    paddingTop: spacing[6],
  },
  progressSection: {
    marginBottom: spacing[10],
    padding: spacing[6],
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
    gap: spacing[5],
    marginBottom: spacing[6],
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
    marginBottom: spacing[4],
    paddingHorizontal: 4,
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
    paddingHorizontal: spacing[4],
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
    paddingLeft: spacing[2],
    paddingRight: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    backgroundColor: colors.peachBase,
    borderWidth: 0.5,
    borderColor: colors.peachSoft,
  },
  nudgeLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.peachPunch,
  },
  footer: {
    marginTop: "auto",
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
});
