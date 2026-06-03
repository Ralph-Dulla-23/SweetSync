import { useState, useCallback, useMemo, useEffect } from 'react';
import { TimeSlot, MyBlock, Preference } from '@/types';
import { getWeekDays } from '@/lib/time';
import { simulator } from '@/lib/simulator';

export function useHeatMap(roomId: string = '1') {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImageUri, setScannedImageUri] = useState<string | null>(null);
  const [draftSchedule, setDraftSchedule] = useState<Map<string, Preference> | null>(null);
  
  const weekDays = useMemo(() => getWeekDays(), []);
  
  const [myBlocks, setMyBlocks] = useState<MyBlock[]>([
    { id: '1', title: 'Math 101', date: weekDays[0] || '', startSlot: 18, endSlot: 20, preference: 1 },
    { id: '2', title: 'English', date: weekDays[1] || '', startSlot: 22, endSlot: 24, preference: 1 },
    { id: '3', title: 'Physics', date: weekDays[2] || '', startSlot: 26, endSlot: 28, preference: 2 },
  ]);

  // Derived map of "date-slot" strings to preferences
  const mySchedule = useMemo(() => {
    const scheduleMap = new Map<string, Preference>();
    myBlocks.forEach(block => {
      if (!block.date) return;
      for (let s = block.startSlot; s <= block.endSlot; s++) {
        scheduleMap.set(`${block.date}-${s}`, block.preference);
      }
    });
    return scheduleMap;
  }, [myBlocks]);

  // Sync my local schedule with the simulator using batch updates
  useEffect(() => {
    const updates: { date: string, slotIndex: number, preference: Preference }[] = [];
    myBlocks.forEach(block => {
      if (!block.date) return;
      for (let s = block.startSlot; s <= block.endSlot; s++) {
        updates.push({ date: block.date, slotIndex: s, preference: block.preference });
      }
    });
    
    if (updates.length > 0) {
      simulator.updateMySchedules(updates);
    }
  }, [myBlocks]);

  const [heatmapData, setHeatmapData] = useState<TimeSlot[][]>([]);

  const fetchHeatmapData = useCallback(() => {
    const data = simulator.getHeatMapData(roomId);
    setHeatmapData(data);
  }, [roomId]);

  useEffect(() => {
    fetchHeatmapData();
    const unsubscribe = simulator.subscribe(() => {
      fetchHeatmapData();
    });
    return () => {
      unsubscribe();
    };
  }, [fetchHeatmapData]);

  const simulateOCR = useCallback((uri: string) => {
    setIsScanning(true);
    setScannedImageUri(uri);
    
    const timeoutId = setTimeout(() => {
      const mockDraft = new Map<string, Preference>();
      // Mock some slots from the first few days
      [0, 1, 2].forEach(d => {
        const date = weekDays[d];
        if (!date) return;
        for (let s = 18; s < 22; s++) {
          mockDraft.set(`${date}-${s}`, 1);
        }
      });
      setDraftSchedule(mockDraft);
      setIsScanning(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [weekDays]);

  const confirmDraft = useCallback(() => {
    if (draftSchedule) {
      const updates: { date: string, slotIndex: number, preference: Preference }[] = [];
      const newBlocks: Omit<MyBlock, 'id'>[] = [];

      draftSchedule.forEach((pref, key) => {
        const parts = key.split('-');
        if (parts.length < 2) return;
        
        const date = parts[0];
        const slotStr = parts[1];
        if (!date || !slotStr) return;

        const slot = parseInt(slotStr);
        if (isNaN(slot)) return;

        updates.push({ date, slotIndex: slot, preference: pref });
        
        newBlocks.push({
          title: 'Scanned Slot',
          date,
          startSlot: slot,
          endSlot: slot,
          preference: pref,
        });
      });

      if (updates.length > 0) {
        simulator.updateMySchedules(updates);
      }

      // Update local blocks in one go
      setMyBlocks(prev => [
        ...prev,
        ...newBlocks.map(b => ({ ...b, id: Math.random().toString(36).substr(2, 9) }))
      ]);

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
    setMyBlocks(prev => {
      const filtered = prev.filter(b => 
        !(b.date === date && slotIndex >= b.startSlot && slotIndex <= b.endSlot)
      );
      // Update simulator
      simulator.updateMySchedule(date, slotIndex, 0);
      return filtered;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSlot(null);
  }, []);

  // Memoize stable return values to prevent HeatMap re-renders
  const magicSlots = useMemo(() => [
    { date: weekDays[5] || '', slotIndex: 16 }, 
    { date: weekDays[5] || '', slotIndex: 17 }
  ], [weekDays]);

  const lowConfidenceCells = useMemo(() => [
    `${weekDays[0] || ''}-20`, 
    `${weekDays[1] || ''}-22`, 
    `${weekDays[2] || ''}-28`
  ].filter(c => !c.startsWith('-')), [weekDays]);

  const emptyDays = useMemo(() => [3, 4], []);
  const potentialMagicSlots = useMemo(() => [1, 2, 3], []);

  return {
    mockData: heatmapData,
    magicSlots,
    selectedSlot,
    myBlocks,
    mySchedule,
    isScanning,
    draftSchedule,
    scannedImageUri,
    lowConfidenceCells,
    emptyDays,
    potentialMagicSlots,
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
