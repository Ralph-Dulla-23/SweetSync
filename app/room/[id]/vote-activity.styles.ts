import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.screen,
  content: {
    ...globalStyles.scrollContent,
    paddingBottom: 120,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing[8],
    gap: spacing[3],
  },
  iconCircle: {
    ...globalStyles.iconCircle,
    backgroundColor: colors.peachBase,
    borderColor: colors.peachSoft,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing[4],
  },
  list: {
    gap: spacing[3],
  },
  cardWrapper: {
    position: 'relative',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedWrapper: {
    borderColor: colors.peachPunch,
    backgroundColor: colors.peachBase,
  },
  aiBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: colors.indigoBase,
    ...globalStyles.row,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.indigoSoft,
    gap: 4,
  },
  aiText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.indigoPunch,
  },
  addSection: {
    marginTop: spacing[8],
    gap: spacing[3],
  },
  sectionLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    fontFamily: fonts.body,
    fontSize: 15,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing[5],
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
  },
});
