import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: {
    // Card component now provides standardized 2px base border
  },
  aiContainer: {
    // Magic styling handled by Card component and inline badge
  },
  selectedContainer: {
    borderColor: colors.peachPunch,
    // borderWidth removed to prevent layout shift
  },
  cardContent: {
    ...globalStyles.rowBetween,
    alignItems: 'center',
    width: '100%',
  },
  textSide: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  selectedTitle: {
    color: colors.peachDeep,
  },
  aiBadgeInline: {
    ...globalStyles.row,
    gap: 4,
  },
  aiTextInline: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.indigoPunch,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  voteBadge: {
    backgroundColor: colors.indigoBase,
    paddingHorizontal: spacing[3],
    paddingVertical: 6,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.indigoSoft,
  },
  selectedVoteBadge: {
    backgroundColor: colors.peachPunch,
    borderColor: colors.peachDeep,
  },
  voteText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.indigoPunch,
  },
  selectedVoteText: {
    color: colors.white,
  },
});
