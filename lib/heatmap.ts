import { colors } from '@/constants/theme';

/**
 * Calculates the heat map shade based on availability ratio and preference weighting.
 * INVERTED LOGIC: Free time is the Signal (Indigo), Busy time is the Background.
 * 
 * @param freeCount Number of members free in this slot
 * @param preferredCount Number of members who PREFER this slot
 * @param totalMembers Total number of members in the room
 * @returns Hex color string for the heat map block
 */
export function getHeatShade(freeCount: number, preferredCount: number, totalMembers: number): string {
  const ratio = freeCount / totalMembers;
  const prefRatio = freeCount > 0 ? preferredCount / freeCount : 0;
  
  // Everyone free
  if (ratio === 1) {
    return prefRatio > 0.5 ? colors.indigoNeon : colors.indigoPunch;
  }
  
  if (ratio >= 0.8) return colors.indigoMid;
  if (ratio >= 0.6) return colors.indigoSoft;
  if (ratio >= 0.4) return colors.indigoBase;
  
  return colors.pageBg;
}
