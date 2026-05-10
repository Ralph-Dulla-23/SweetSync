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
    height: 200,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing[5],
    paddingTop: 12,
    ...globalStyles.shadowMd,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    zIndex: 10,
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
});
