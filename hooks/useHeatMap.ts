import { useState, useCallback, useMemo } from 'react';
import { TimeSlot, MyBlock, Preference } from '@/types';
import { getWeekDays } from '@/lib/time';

// Utility for generating mock data outside of the hook
export const generateMockHeatMapData = (totalMembers: number, mySchedule: Map<string, Preference>): TimeSlot[][] => {
  const data: TimeSlot[][] = [];
  const memberPool = ["Alex", "Jordan", "Taylor", "Riley", "Quinn"];
  const weekDays = getWeekDays();
  
  for (let d = 0; d < 7; d++) {
    const date = weekDays[d];
    const dayData: TimeSlot[] = [];
    
    for (let s = 0; s < 48; s++) {
      let freeCount = 0;
      let preferredCount = 0;
      
      // Weekend: More free time
      if (d >= 5) {
        freeCount = Math.floor(Math.random() * 2) + 3; // 3-4 other members
        preferredCount = Math.floor(Math.random() * 2);
      } 
      // Weekdays: Busy mornings, some free evenings
      else {
        if (s < 16) freeCount = Math.floor(Math.random() * 2); // Morning (0-8am)
        else if (s > 40) freeCount = Math.floor(Math.random() * 2) + 1; // Evening (8pm+)
        else freeCount = Math.floor(Math.random() * 3);
        
        preferredCount = freeCount > 1 ? 1 : 0;
      }

      const myPref = mySchedule.get(`${date}-${s}`) ?? 0;
      const isMeBusy = myPref === 0;
      const isMeFree = myPref === 1;
      const isMePreferred = myPref === 2;
      
      const othersFree = memberPool.slice(0, freeCount);
      const othersPreferred = othersFree.slice(0, preferredCount);
      const othersBusy = memberPool.slice(freeCount);
      
      const finalMembers = [...othersFree, ...((isMeFree || isMePreferred) ? ["Me"] : [])];
      const finalPreferredMembers = [...othersPreferred, ...(isMePreferred ? ["Me"] : [])];
      const finalBusyMembers = [...othersBusy, ...(isMeBusy ? ["Me"] : [])];

      dayData.push({
        date,
        slotIndex: s,
        freeCount: finalMembers.length,
        preferredCount: finalPreferredMembers.length,
        members: finalMembers,
        preferredMembers: finalPreferredMembers,
        busyMembers: finalBusyMembers,
      });
    }
    data.push(dayData);
  }
  return data;
};

export function useHeatMap(totalMembers: number = 5) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImageUri, setScannedImageUri] = useState<string | null>(null);
  const [draftSchedule, setDraftSchedule] = useState<Map<string, Preference> | null>(null);
  
  const weekDays = useMemo(() => getWeekDays(), []);
  
  const [myBlocks, setMyBlocks] = useState<MyBlock[]>([
    { id: '1', title: 'Math 101', date: weekDays[0], startSlot: 18, endSlot: 20, preference: 1 },
    { id: '2', title: 'English', date: weekDays[1], startSlot: 22, endSlot: 24, preference: 1 },
    { id: '3', title: 'Physics', date: weekDays[2], startSlot: 26, endSlot: 28, preference: 2 },
  ]);

  // Derived map of "date-slot" strings to preferences
  const mySchedule = useMemo(() => {
    const scheduleMap = new Map<string, Preference>();
    myBlocks.forEach(block => {
      for (let s = block.startSlot; s <= block.endSlot; s++) {
        scheduleMap.set(`${block.date}-${s}`, block.preference);
      }
    });
    return scheduleMap;
  }, [myBlocks]);

  // Generate mock data using the utility
  const mockData = useMemo(() => {
    return generateMockHeatMapData(totalMembers, mySchedule);
  }, [totalMembers, mySchedule]);

  const simulateOCR = useCallback((uri: string) => {
    setIsScanning(true);
    setScannedImageUri(uri);
    
    setTimeout(() => {
      const mockDraft = new Map<string, Preference>();
      // Mock some slots from the first few days
      [0, 1, 2].forEach(d => {
        const date = weekDays[d];
        for (let s = 18; s < 22; s++) {
          mockDraft.set(`${date}-${s}`, 1);
        }
      });
      setDraftSchedule(mockDraft);
      setIsScanning(false);
    }, 2000);
  }, [weekDays]);

  const confirmDraft = useCallback(() => {
    if (draftSchedule) {
      console.log("Confirming draft schedule...");
      setDraftSchedule(null);
    }
  }, [draftSchedule]);

  const discardDraft = useCallback(() => {
    setDraftSchedule(null);
    setScannedImageUri(null);
  }, []);

  const toggleDraftCell = useCallback((date: string, slotIndex: number) => {
    setDraftSchedule(prev => {
      if (!prev) return null;
      const next = new Map(prev);
      const key = `${date}-${slotIndex}`;
      if (next.has(key)) {
        const current = next.get(key);
        if (current === 1) next.set(key, 2); // Cycle: Free -> Preferred
        else next.delete(key); // Cycle: Preferred -> Busy/None
      } else {
        next.set(key, 1); // Cycle: Busy/None -> Free
      }
      return next;
    });
  }, []);

  const handleCellPress = useCallback((slot: TimeSlot) => {
    setSelectedSlot(slot);
  }, []);

  const addBlock = useCallback((block: Omit<MyBlock, 'id'>) => {
    const newBlock = {
      ...block,
      id: Math.random().toString(36).substr(2, 9),
    };
    setMyBlocks(prev => [...prev, newBlock]);
  }, []);

  const removeBlockAt = useCallback((date: string, slotIndex: number) => {
    setMyBlocks(prev => prev.filter(b => 
      !(b.date === date && slotIndex >= b.startSlot && slotIndex <= b.endSlot)
    ));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSlot(null);
  }, []);

  return {
    mockData,
    magicSlots: [{ date: weekDays[5], slotIndex: 16 }, { date: weekDays[5], slotIndex: 17 }],
    selectedSlot,
    myBlocks,
    mySchedule,
    isScanning,
    draftSchedule,
    scannedImageUri,
    lowConfidenceCells: [`${weekDays[1]}-22`],
    emptyDays: [3],
    potentialMagicSlots: [1, 2],
    simulateOCR,
    confirmDraft,
    toggleDraftCell,
    discardDraft,
    handleCellPress,
    addBlock,
    removeBlockAt,
    clearSelection,
  };
}
