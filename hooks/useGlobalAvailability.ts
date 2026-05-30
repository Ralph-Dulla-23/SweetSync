import { useMemo, useCallback, useState } from 'react';
import { GlobalBlock, Preference } from '@/types';
import { getWeekDays } from '@/lib/time';

export function useGlobalAvailability() {
  const weekDays = useMemo(() => getWeekDays(), []);
  
  const [personalBlocks, setPersonalBlocks] = useState<GlobalBlock[]>([
    { 
      id: 'p1', 
      title: 'Gym', 
      date: weekDays[0], 
      startSlot: 14, 
      endSlot: 16, 
      preference: 1, 
      sourceType: 'personal' 
    },
  ]);

  const [roomBlocks, setRoomBlocks] = useState<GlobalBlock[]>([
    { 
      id: 'r1', 
      title: 'Study Session', 
      date: weekDays[1], 
      startSlot: 20, 
      endSlot: 24, 
      preference: 1, 
      sourceType: 'room',
      roomId: 'room-123',
      roomName: 'Study Squad'
    },
    { 
      id: 'r2', 
      title: 'Project Alpha Kickoff', 
      date: weekDays[2], 
      startSlot: 28, 
      endSlot: 32, 
      preference: 2, 
      sourceType: 'room',
      roomId: 'room-456',
      roomName: 'Project Alpha'
    },
  ]);

  const allBlocks = useMemo(() => [...personalBlocks, ...roomBlocks], [personalBlocks, roomBlocks]);

  const isEmpty = useMemo(() => allBlocks.length === 0, [allBlocks]);

  const checkConflict = useCallback((date: string, startSlot: number, endSlot: number): GlobalBlock[] => {
    return allBlocks.filter(block => {
      return block.date === date && (
        (startSlot >= block.startSlot && startSlot <= block.endSlot) ||
        (endSlot >= block.startSlot && endSlot <= block.endSlot) ||
        (block.startSlot >= startSlot && block.startSlot <= endSlot)
      );
    });
  }, [allBlocks]);

  const mySchedule = useMemo(() => {
    const scheduleMap = new Map<string, Preference>();
    allBlocks.forEach(block => {
      for (let s = block.startSlot; s <= block.endSlot; s++) {
        scheduleMap.set(`${block.date}-${s}`, block.preference);
      }
    });
    return scheduleMap;
  }, [allBlocks]);

  return {
    allBlocks,
    mySchedule,
    isEmpty,
    checkConflict,
  };
}
