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
    console.log(`User ${userId} voting for ${optionId} in room ${roomId}`);
  }, [roomId]);

  const addOption = useCallback(async (title: string) => {
    // Placeholder for Supabase add option
    console.log(`Adding vote option ${title} to room ${roomId}`);
  }, [roomId]);

  return {
    options,
    loading,
    castVote,
    addOption,
  };
}
