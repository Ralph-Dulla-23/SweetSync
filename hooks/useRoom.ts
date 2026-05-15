import { useState, useCallback, useEffect } from 'react';
import { Room, Member } from '@/types';

// Mock data for initial development
const MOCK_ROOMS: Record<string, Room> = {
  '1': {
    id: '1',
    name: 'Friday Gang',
    description: 'Coordinate with the squad',
    sessionStatus: 'voting_slots',
    hostId: 'mock-user-123',
    members: [
      { id: '1', name: 'Raphael', status: 'uploaded', isHost: true },
      { id: '2', name: 'Jamie', status: 'uploaded' },
      { id: '3', name: 'Marco', status: 'uploaded' },
      { id: '4', name: 'Trisha', status: 'uploaded' },
      { id: '5', name: 'Ana', status: 'uploaded' },
    ],
    upcomingEvents: [
      {
        id: 'e1',
        roomId: '1',
        title: 'Friday Night Tacos',
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        startSlot: 38, // 7 PM
        endSlot: 42,   // 9 PM
        location: 'Taco Bell',
        category: 'food',
        members: ['1', '2', '3', '4', '5']
      }
    ],
    activitySuggestions: [
      {
        id: 's1',
        title: 'Game Night',
        description: 'Casual board games and drinks',
        duration: 4,
        category: 'social',
        votes: 3
      },
      {
        id: 's2',
        title: 'Late Night Study',
        description: 'Focus session for the upcoming exam',
        duration: 6,
        category: 'study',
        votes: 1
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  '2': {
    id: '2',
    name: 'Study Squad',
    sessionStatus: 'collecting',
    hostId: 'mock-user-123',
    members: [
      { id: '1', name: 'Raphael', status: 'uploaded', isHost: true },
      { id: '6', name: 'Kevin', status: 'pending' },
      { id: '7', name: 'Sarah', status: 'pending' },
    ],
    activitySuggestions: [
      {
        id: 's3',
        title: 'Library Grind',
        description: '4-hour session at the library',
        duration: 8,
        category: 'study',
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
};

export function useRoom(roomId: string) {
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);

  const fetchRoomDetails = useCallback(async () => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setRoom(MOCK_ROOMS[roomId] || null);
      setLoading(false);
    }, 500);
  }, [roomId]);

  useEffect(() => {
    fetchRoomDetails();
  }, [fetchRoomDetails]);

  const updateMemberStatus = useCallback(async (userId: string, status: Member['status']) => {
    setRoom(prev => {
      if (!prev) return null;
      return {
        ...prev,
        members: prev.members.map(m => m.id === userId ? { ...m, status } : m)
      };
    });
    // Placeholder for Supabase update
    console.log(`Updating member ${userId} status to ${status}...`);
  }, []);

  const nudgeMember = useCallback(async (userId: string) => {
    // Placeholder for notification trigger
    console.log(`Nudging member ${userId}...`);
  }, []);

  return {
    room,
    loading,
    refresh: fetchRoomDetails,
    updateMemberStatus,
    nudgeMember,
  };
}
