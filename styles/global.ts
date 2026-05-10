import { StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radius } from '@/constants/theme';

/**
 * Global Styles
 * Use these for common layout patterns to keep component files compact.
 */
export const globalStyles = StyleSheet.create({
  // Main screen container
  screen: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  
  // Standard scroll content with padding
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[10],
  },
  
  // Flexbox helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Common UI Elements
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  
  shadowSm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  
  shadowMd: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  }
});
