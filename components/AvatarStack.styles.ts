import { StyleSheet } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { globalStyles } from '@/styles/global';

export const styles = StyleSheet.create({
  container: globalStyles.row,
  more: {
    backgroundColor: colors.indigoBase,
    ...globalStyles.center,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  moreText: {
    fontFamily: fonts.bodySemibold,
    color: colors.indigoPunch,
  },
});
