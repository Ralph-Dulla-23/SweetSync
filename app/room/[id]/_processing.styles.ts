import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[8],
  },
  centerCluster: {
    alignItems: 'center',
    marginBottom: spacing[12],
  },
  pulseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.indigoBase,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.indigoDeep,
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing[3],
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: colors.indigoBase,
    borderRadius: radius.full,
    marginTop: spacing[8],
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.indigoPunch,
  },
  statusList: {
    width: '100%',
    paddingHorizontal: spacing[4],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
    gap: spacing[3],
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  statusTextPending: {
    color: colors.textSecondary,
  },
});
