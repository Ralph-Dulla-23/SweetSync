import { StyleSheet } from 'react-native';
import { radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
