import { colors } from '@/constants/theme';

/**
 * Calculates the heat map shade based on availability ratio.
 * 
 * @param freeCount Number of members free in this slot
 * @param totalMembers Total number of members in the room
 * @returns Hex color string for the heat map block
 */
export function getHeatShade(freeCount: number, totalMembers: number): string {
  const ratio = freeCount / totalMembers;
  
  if (ratio === 1)   return colors.pageBg;    // everyone free
  if (ratio >= 0.8)  return colors.indigoBase; // most people free
  if (ratio >= 0.6)  return colors.indigoSoft; // mixed availability
  if (ratio >= 0.4)  return colors.indigoMid;  // mostly busy
  
  return colors.indigoPunch;                    // nearly everyone busy
}
