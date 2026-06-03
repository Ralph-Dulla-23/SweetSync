import { StyleSheet, Platform } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.02)',
    boxShadow: `0px -4px 20px rgba(0,0,0,0.06)`,
  },
  slidingPillContainer: {
    position: 'absolute',
    top: 8,
    height: 30,
    ...globalStyles.center,
  },
  activePillIndicator: {
    width: 42,
    height: 30,
    backgroundColor: colors.peachBase,
    borderRadius: 15,
  },
  tabItem: {
    flex: 1,
    ...globalStyles.center,
    zIndex: 1,
  },
  iconWrapper: {
    width: 42,
    height: 30,
    ...globalStyles.center,
    borderRadius: 15,
  },
  activePill: {
    backgroundColor: colors.peachBase,
  },
  tabLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    marginTop: 2,
    letterSpacing: -0.1,
  },
  createButtonTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 2,
  },
  createButton: {
    top: -24,
    width: 56,
    height: 56,
    backgroundColor: colors.indigoPunch,
    borderRadius: 28,
    ...globalStyles.center,
    boxShadow: `0px 4px 12px ${colors.indigoPunch}4D, 0px 8px 24px ${colors.indigoPunch}26`,
    borderWidth: 3,
    borderColor: colors.white,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: '20%',
    backgroundColor: colors.peachPunch,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    ...globalStyles.center,
    borderWidth: 1.5,
    borderColor: colors.white,
    zIndex: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.bodySemibold,
  },
});
