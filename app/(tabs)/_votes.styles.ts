import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  content: globalStyles.scrollContent,
  list: {
    gap: spacing[3],
  },
  voteCard: {
    ...globalStyles.rowBetween,
    padding: spacing[4],
    minHeight: 100,
  },
  cardLeft: {
    ...globalStyles.row,
    gap: spacing[3],
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    ...globalStyles.center,
  },
  info: {
    gap: 2,
    flex: 1,
  },
  roomName: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.peachDeep,
  },
  voteType: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  deadline: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  cardRight: {
    ...globalStyles.row,
    gap: spacing[2],
  },
  emptyState: {
    flex: 1,
    marginTop: 100,
    ...globalStyles.center,
    gap: spacing[4],
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.textSecondary,
  },
  emptySubtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
