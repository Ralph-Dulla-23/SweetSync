import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  gridContainer: {
    marginTop: spacing[2],
    paddingHorizontal: spacing[4],
  },
  dayHeaderRow: {
    ...globalStyles.row,
    marginBottom: spacing[3],
  },
  timeLabelSpacer: {
    width: 44,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: "center",
  },
  dayLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  todayLabel: {
    color: colors.peachPunch,
  },
  gridBody: {
    flexDirection: "row",
  },
  timeColumn: {
    width: 44,
    justifyContent: "space-between",
  },
  timeLabelCell: {
    height: 48, 
    justifyContent: "flex-start",
  },
  timeLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: "right",
    paddingRight: 8,
    marginTop: -6,
  },
  cellsArea: {
    flex: 1,
    flexDirection: "row",
    gap: 1.5,
  },
  column: {
    flex: 1,
    gap: 1.5,
  },
  cellWrapper: {
    height: 24,
  },
  cell: {
    flex: 1,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.03)",
    ...globalStyles.center,
    overflow: 'hidden',
    paddingHorizontal: 2,
  },
  magicSlotCell: {
    backgroundColor: colors.peachBase,
    borderColor: colors.peachPunch,
    borderWidth: 1.5,
    zIndex: 1,
  },
  selectedCell: {
    borderColor: colors.indigoPunch,
    borderWidth: 2,
    zIndex: 2,
    boxShadow: `0px 0px 4px ${colors.indigoPunch}80`,
  },
  myBusyCell: {
    borderColor: colors.indigoMid,
    borderWidth: 0.5,
  },
  selectionIndicator: {
    ...globalStyles.row,
    backgroundColor: colors.indigoPunch,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  selectionText: {
    color: 'white',
    fontSize: 10,
    fontFamily: fonts.bodySemibold,
  },
  sparkleContainer: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.peachPunch,
    zIndex: 2,
    ...globalStyles.shadowSm,
    boxShadow: `0px 2px 4px ${colors.peachPunch}0D`,
  },
  cellTitle: {
    fontSize: 8,
    fontFamily: fonts.bodySemibold,
    color: colors.white,
    textAlign: 'center',
  },
});
