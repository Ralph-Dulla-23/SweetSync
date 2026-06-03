import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  content: {
    ...globalStyles.scrollContent,
    paddingTop: spacing[6],
  },
  sectionContainer: {
    gap: spacing[8],
  },
  userCard: {
    ...globalStyles.row,
    backgroundColor: colors.white,
    padding: spacing[5],
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.peachSoft,
    gap: spacing[4],
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.textPrimary,
  },
  userEmail: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  editProfileBtn: {
    backgroundColor: colors.peachBase,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.peachSoft,
  },
  editProfileText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.peachPunch,
  },
  section: {
    gap: spacing[3],
  },
  sectionLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.textTertiary,
    letterSpacing: 1.5,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    overflow: 'hidden',
  },
  engineCard: {
    borderColor: colors.indigoSoft,
    backgroundColor: colors.indigoBase,
  },
  engineRow: {
    backgroundColor: 'transparent',
  },
  row: {
    ...globalStyles.rowBetween,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.white,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.borderDefault,
    marginHorizontal: spacing[4],
  },
  rowLeft: {
    ...globalStyles.row,
    gap: spacing[3],
  },
  rowText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  rowRight: {
    ...globalStyles.row,
    gap: spacing[2],
  },
  rowValue: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  signOutRow: {
    borderTopWidth: 0,
    backgroundColor: 'transparent',
  },
  dangerZone: {
    gap: spacing[3],
    marginTop: spacing[4],
  },
  dangerZoneLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.voteCantText,
    letterSpacing: 1.5,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  dangerZoneCard: {
    backgroundColor: colors.voteCantBg,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.voteCantBorder,
    overflow: 'hidden',
  },
  dangerZoneText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: colors.voteCantText,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.indigoBase,
  },
  badgeText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.indigoPunch,
    textTransform: 'uppercase',
  },
  backButton: {
    ...globalStyles.row,
    gap: 4,
    marginBottom: spacing[4],
  },
  backButtonText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: colors.peachPunch,
  },
  filesHeader: {
    gap: 4,
    marginBottom: spacing[4],
  },
  filesTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.textPrimary,
  },
  filesSubtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  fileList: {
    gap: spacing[4],
  },
  fileCard: {
    ...globalStyles.row,
    backgroundColor: colors.white,
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.borderDefault,
    gap: spacing[4],
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.indigoBase,
    ...globalStyles.center,
  },
  fileInfo: {
    flex: 1,
    gap: 2,
  },
  fileName: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  fileDate: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textTertiary,
  },
  deleteBtn: {
    padding: spacing[2],
  },
  uploadBtn: {
    height: 60,
    marginTop: spacing[6],
  },
  clearAllBtn: {
    alignSelf: 'center',
    marginTop: spacing[4],
    padding: spacing[2],
  },
  clearAllText: {
    fontFamily: fonts.bodySemibold,
    color: colors.textTertiary,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: spacing[12],
    ...globalStyles.shadowMd,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.borderDefault,
    borderRadius: 2,
  },
  modalBody: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[2],
  },
  modalTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: spacing[6],
  },
  modalOption: {
    ...globalStyles.row,
    paddingVertical: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
    gap: spacing[4],
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  modalOptionDescription: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalCloseBtn: {
    marginTop: spacing[8],
    height: 56,
  },

  // Support & Policy Styles
  contentHeader: {
    marginBottom: spacing[6],
  },
  contentTitle: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.textPrimary,
    marginBottom: spacing[2],
  },
  contentSubtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  articleSection: {
    gap: spacing[6],
    marginBottom: spacing[10],
  },
  articleTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing[2],
  },
  articleBody: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  faqItem: {
    backgroundColor: colors.white,
    padding: spacing[5],
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    gap: spacing[2],
  },
  faqQuestion: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  faqAnswer: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  emptyFileCard: {
    padding: spacing[8],
    ...globalStyles.center,
    gap: spacing[4],
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.borderDefault,
    borderStyle: 'dashed',
  },
  emptyFileText: {
    fontFamily: fonts.bodySemibold,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  }
});
