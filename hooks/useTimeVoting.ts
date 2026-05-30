import { useState, useCallback, useMemo } from 'react';
import { useGlobalAvailability } from './useGlobalAvailability';
import { GlobalBlock } from '@/types';

export type VoteType = 'free' | 'prefer' | 'cant';

interface TimeVote {
  slotId: string;
  date: string;
  startSlot: number;
  endSlot: number;
  type: VoteType;
}

export function useTimeVoting(roomId: string) {
  const { checkConflict } = useGlobalAvailability();
  
  // In a real app, this would be fetched from Supabase
  const [votes, setVotes] = useState<Record<string, TimeVote>>({
    'slot-1': { slotId: '1', date: '2026-05-19', startSlot: 36, endSlot: 40, type: 'prefer' },
  });

  const castVote = useCallback((slotId: string, date: string, startSlot: number, endSlot: number, type: VoteType) => {
    setVotes(prev => ({
      ...prev,
      [slotId]: { slotId, date, startSlot, endSlot, type }
    }));
  }, []);

  const staleVotes = useMemo(() => {
    return Object.values(votes).filter(vote => {
      if (vote.type === 'cant') return false;
      const conflicts = checkConflict(vote.date, vote.startSlot, vote.endSlot);
      // We only care about personal conflicts making a 'free/prefer' vote stale
      return conflicts.some(c => c.sourceType === 'personal');
    });
  }, [votes, checkConflict]);

  const hasStaleVotes = staleVotes.length > 0;

  return {
    votes,
    castVote,
    staleVotes,
    hasStaleVotes,
  };
}
