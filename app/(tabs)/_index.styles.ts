import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  list: {
    paddingTop: spacing[4],
    paddingBottom: 120,
  },
  sectionHeader: {
    paddingHorizontal: spacing[5],
    marginTop: spacing[6],
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.textPrimary,
  },
  cardGapContainer: {
    paddingHorizontal: spacing[5],
    gap: spacing[4],
  },
  roomCard: {
    minHeight: 110,
    justifyContent: "space-between",
    padding: spacing[4],
    borderWidth: 2,
    borderColor: colors.peachSoft,
  },
  cardTop: globalStyles.rowBetween,
  roomName: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.peachDeep,
  },
  cardBottom: {
    ...globalStyles.rowBetween,
    marginTop: spacing[4],
  },
  detailText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
  },
  horizontalScroll: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
    paddingBottom: spacing[4],
  },
  ticketWrapper: {
    width: 240,
  },
  ticketCard: {
    ...globalStyles.rowBetween,
    padding: spacing[4],
    minHeight: 90,
    borderWidth: 2,
    borderColor: colors.mintSoft,
  },
  ticketLeft: {
    flex: 1,
    gap: 1,
  },
  ticketTitle: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.mintPunch,
  },
  ticketRoom: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  ticketTimeRow: {
    ...globalStyles.row,
    gap: 4,
  },
  ticketDate: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textTertiary,
  },
  joinBarContainer: {
    paddingHorizontal: spacing[5],
    marginTop: spacing[2],
  },
  joinBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing[2],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    gap: spacing[2],
    alignItems: 'center',
    ...globalStyles.shadowSm,
  },
  joinInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: spacing[3],
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  joinButton: {
    height: 44,
    paddingVertical: 0,
    paddingHorizontal: spacing[4],
    borderRadius: radius.md,
  },
});
