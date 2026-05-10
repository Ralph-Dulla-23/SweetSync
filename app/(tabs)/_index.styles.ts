import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  list: {
    paddingTop: spacing[4],
    paddingBottom: spacing[10],
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
    gap: spacing[3],
  },
  roomCard: {
    minHeight: 110,
    justifyContent: "space-between",
    padding: spacing[4],
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
});
