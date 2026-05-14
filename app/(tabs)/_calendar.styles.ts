import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  month: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  sectionHeader: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing[2],
  },
  legendContainer: {
    marginTop: spacing[8],
    alignItems: "center",
    gap: spacing[4],
  },
  legendRow: {
    ...globalStyles.row,
    gap: spacing[4],
  },
  legendGradient: {
    flexDirection: "row",
    height: 12,
    width: 160,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
  },
  legendStep: {
    flex: 1,
  },
  legendText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 340, // Increased to account for bottom insets
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing[5],
    paddingTop: 12,
    ...globalStyles.shadowMd,
    boxShadow: `0px -4px 16px ${colors.black}1A`,
    zIndex: 1000,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderDefault,
    marginBottom: 16,
    alignSelf: 'center',
  },
  detailHeader: {
    marginBottom: spacing[4],
  },
  detailTitleRow: {
    ...globalStyles.rowBetween,
    marginBottom: 4,
  },
  detailTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.textPrimary,
  },
  detailSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  memberList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  memberChip: {
    ...globalStyles.row,
    backgroundColor: colors.indigoBase,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    gap: spacing[1],
  },
  memberChipText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.indigoPunch,
  },
  taskSection: {
    marginTop: spacing[8],
    paddingHorizontal: spacing[5],
  },
  taskHeader: {
    marginBottom: spacing[4],
  },
  taskSectionTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textPrimary,
  },
  taskList: {
    gap: spacing[3],
  },
  taskItem: {
    ...globalStyles.rowBetween,
    backgroundColor: colors.white,
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 2,
  },
  squadTask: {
    borderColor: colors.mintSoft,
  },
  personalTask: {
    borderColor: colors.peachSoft,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  taskTime: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.textTertiary,
    width: 60,
  },
  taskDetails: {
    gap: 1,
  },
  taskTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.textPrimary,
  },
  taskSquad: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  taskStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
