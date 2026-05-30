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
    borderWidth: 2,
    borderColor: colors.borderDefault,
    overflow: 'hidden',
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
    marginTop: spacing[4],
    backgroundColor: 'transparent',
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
