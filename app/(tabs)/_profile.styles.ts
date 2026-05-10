import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  content: globalStyles.scrollContent,
  sectionContainer: {
    gap: spacing[6],
  },
  userCard: {
    ...globalStyles.row,
    backgroundColor: colors.white,
    padding: spacing[5],
    borderRadius: radius.xl,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.07)',
    gap: spacing[4],
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.textPrimary,
  },
  userEmail: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  editProfileBtn: {
    backgroundColor: colors.peachBase,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  editProfileText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.peachPunch,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
    paddingVertical: spacing[4],
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.textPrimary,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  section: {
    gap: spacing[1],
  },
  sectionLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    color: colors.textTertiary,
    letterSpacing: 1.5,
    marginBottom: spacing[2],
    marginLeft: 4,
  },
  row: {
    ...globalStyles.rowBetween,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.white,
    borderRadius: radius.md,
    marginBottom: spacing[1],
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.03)',
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
  toggle: {
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.textTertiary,
  },
  toggleOn: {
    backgroundColor: colors.peachPunch,
  },
  backButton: {
    ...globalStyles.row,
    gap: 4,
  },
  backButtonText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.peachPunch,
  },
  filesHeader: {
    gap: 4,
  },
  filesTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.textPrimary,
  },
  filesSubtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  fileList: {
    gap: spacing[3],
  },
  fileCard: {
    ...globalStyles.row,
    backgroundColor: colors.white,
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
    gap: spacing[4],
  },
  fileIcon: {
    width: 44,
    height: 44,
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
    height: 56,
    marginTop: spacing[4],
  },
});
