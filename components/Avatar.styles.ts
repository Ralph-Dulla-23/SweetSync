import { StyleSheet } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.indigoBase,
  },
  placeholder: globalStyles.center,
  initials: {
    fontFamily: fonts.bodySemibold,
    color: colors.peachDeep,
  },
});
