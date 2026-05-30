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
    boxShadow: `0px -4px 16px ${colors.black}0F`,
  },
  tabItem: {
    flex: 1,
    ...globalStyles.center,
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
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  createButtonTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  createButton: {
    top: -20,
    width: 52,
    height: 52,
    backgroundColor: colors.indigoPunch,
    borderRadius: 26,
    ...globalStyles.center,
    boxShadow: `0px 6px 12px ${colors.indigoPunch}66`,
    borderWidth: 3,
    borderColor: colors.white,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: '20%',
    backgroundColor: colors.peachPunch,
    width: 16,
    height: 16,
    borderRadius: 8,
    ...globalStyles.center,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.bodySemibold,
  },
});
