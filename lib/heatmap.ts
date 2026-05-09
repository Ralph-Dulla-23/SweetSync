import { colors } from '@/constants/theme';

/**
 * Calculates the heat map shade based on availability ratio.
 * INVERTED LOGIC: Free time is the Signal (Indigo), Busy time is the Background.
 * 
 * @param freeCount Number of members free in this slot
 * @param totalMembers Total number of members in the room
 * @returns Hex color string for the heat map block
 */
export function getHeatShade(freeCount: number, totalMembers: number): string {
  const ratio = freeCount / totalMembers;
  
  if (ratio === 1)   return colors.indigoPunch; // SIGNAL: Everyone is free
  if (ratio >= 0.8)  return colors.indigoMid;   // Strong signal
  if (ratio >= 0.6)  return colors.indigoSoft;  // Weak signal
  if (ratio >= 0.4)  return colors.indigoBase;  // Trace signal
  
  return colors.pageBg;                          // BACKGROUND: Everyone busy
}
