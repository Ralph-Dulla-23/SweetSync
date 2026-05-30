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
    paddingBottom: 120,
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
    boxShadow: `0px 2px 4px ${colors.black}0D`, // ~0.05 opacity
    elevation: 2,
  },
  
  shadowMd: {
    boxShadow: `0px 4px 8px ${colors.black}1A`, // ~0.1 opacity
    elevation: 4,
  }
});
