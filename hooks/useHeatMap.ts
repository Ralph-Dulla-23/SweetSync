import { useState, useCallback, useMemo } from 'react';
import { TimeSlot, MyBlock } from '@/types';

// Utility for generating mock data outside of the hook
export const generateMockHeatMapData = (totalMembers: number, mySchedule: Set<string>): TimeSlot[][] => {
  const data: TimeSlot[][] = [];
  const memberPool = ["Alex", "Jordan", "Taylor", "Riley", "Quinn"];
  
  for (let d = 0; d < 7; d++) {
    const dayData: TimeSlot[] = [];
    for (let h = 0; h < 14; h++) {
      let freeCount = 0;
      
      // Weekend: More free time
      if (d >= 5) {
        freeCount = Math.floor(Math.random() * 2) + 3; // 3-4 other members
      } 
      // Weekdays: Busy mornings, some free evenings
      else {
        if (h < 4) freeCount = Math.floor(Math.random() * 2); 
        else if (h > 10) freeCount = Math.floor(Math.random() * 2) + 1;
        else freeCount = Math.floor(Math.random() * 3);
      }

      const isMeBusy = mySchedule.has(`${d}-${h}`);
      const isMeFree = !isMeBusy;
      
      const othersFree = memberPool.slice(0, freeCount);
      const othersBusy = memberPool.slice(freeCount);
      
      const finalMembers = [...othersFree, ...(isMeFree ? ["Me"] : [])];
      const finalBusyMembers = [...othersBusy, ...(isMeBusy ? ["Me"] : [])];

      // Magic slot simulation
      if (d === 5 && h === 8) {
        const forcedFreeCount = isMeFree ? 5 : 4;
        dayData.push({
          dayIndex: d,
          hourIndex: h,
          freeCount: forcedFreeCount,
          members: [...memberPool, ...(isMeFree ? ["Me"] : [])].slice(0, forcedFreeCount),
          busyMembers: isMeFree ? [] : ["Me"],
        });
        continue;
      }

      dayData.push({
        dayIndex: d,
        hourIndex: h,
        freeCount: finalMembers.length,
        members: finalMembers,
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
  const [draftSchedule, setDraftSchedule] = useState<Set<string> | null>(null);
  
  const [myBlocks, setMyBlocks] = useState<MyBlock[]>([
    { id: '1', title: 'Math 101', dayIndex: 0, startHour: 0, endHour: 1 },
    { id: '2', title: 'English', dayIndex: 1, startHour: 2, endHour: 3 },
    { id: '3', title: 'Physics', dayIndex: 2, startHour: 4, endHour: 5 },
  ]);

  // Derived set of busy "day-hour" strings
  const mySchedule = useMemo(() => {
    const busySet = new Set<string>();
    myBlocks.forEach(block => {
      for (let h = block.startHour; h <= block.endHour; h++) {
        busySet.add(`${block.dayIndex}-${h}`);
      }
    });
    return busySet;
  }, [myBlocks]);

  // Generate mock data using the utility
  const mockData = useMemo(() => {
    return generateMockHeatMapData(totalMembers, mySchedule);
  }, [totalMembers, mySchedule]);

  // Rest of the logic (OCR simulation, adding/removing blocks)...
  
  const simulateOCR = useCallback((uri: string) => {
    setIsScanning(true);
    setScannedImageUri(uri);
    
    setTimeout(() => {
      const mockDraft = new Set(["0-0", "0-1", "1-2", "1-3", "2-4", "2-5", "4-6", "4-7"]);
      setDraftSchedule(mockDraft);
      setIsScanning(false);
    }, 2000);
  }, []);

  const confirmDraft = useCallback(() => {
    if (draftSchedule) {
      // In a real app, we'd map draft cells back to MyBlock entities
      console.log("Confirming draft schedule...");
      setDraftSchedule(null);
    }
  }, [draftSchedule]);

  const discardDraft = useCallback(() => {
    setDraftSchedule(null);
    setScannedImageUri(null);
  }, []);

  const toggleDraftCell = useCallback((dayIndex: number, hourIndex: number) => {
    setDraftSchedule(prev => {
      if (!prev) return null;
      const next = new Set(prev);
      const key = `${dayIndex}-${hourIndex}`;
      if (next.has(key)) next.delete(key);
      else next.add(key);
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

  const removeBlockAt = useCallback((dayIndex: number, hourIndex: number) => {
    setMyBlocks(prev => prev.filter(b => 
      !(b.dayIndex === dayIndex && hourIndex >= b.startHour && hourIndex <= b.endHour)
    ));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSlot(null);
  }, []);

  return {
    mockData,
    magicSlots: [{ dayIndex: 5, hourIndex: 8 }, { dayIndex: 5, hourIndex: 9 }],
    selectedSlot,
    myBlocks,
    mySchedule,
    isScanning,
    draftSchedule,
    scannedImageUri,
    lowConfidenceCells: ["1-2"],
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
