import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: {
    // Card component already provides spacing[4] padding and base border
  },
  perfectContainer: {
    // Perfect logic handled by Card 'mint' variant
  },
  content: {
    ...globalStyles.rowBetween,
    alignItems: 'center',
    width: '100%',
  },
  left: {
    gap: 2,
    flex: 1,
  },
  time: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textPrimary,
  },
  stats: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
  },
  perfectBadge: {
    ...globalStyles.row,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.mintSoft,
    gap: 4,
  },
  perfectText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.mintPunch,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
