import { useState, useCallback } from 'react';

interface VoteOption {
  id: string;
  title: string;
  votes: number;
  votedBy: string[];
}

export function useVoting(roomId: string) {
  const [options, setOptions] = useState<VoteOption[]>([]);
  const [loading, setLoading] = useState(false);

  const castVote = useCallback(async (optionId: string, userId: string) => {
    // Placeholder for Supabase vote logic
  }, [roomId]);

  const addOption = useCallback(async (title: string) => {
    // Placeholder for Supabase add option
  }, [roomId]);

  return {
    options,
    loading,
    castVote,
    addOption,
  };
}
