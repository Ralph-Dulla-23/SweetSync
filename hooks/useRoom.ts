import { useState, useCallback, useEffect } from 'react';
import { Room, Member } from '@/types';

// Mock data for initial development
const MOCK_ROOMS: Record<string, Room> = {
  '1': {
    id: '1',
    name: 'Friday Gang',
    description: 'Coordinate with the squad',
    status: 'voting',
    hostId: 'mock-user-123',
    members: [
      { id: '1', name: 'Raphael', status: 'uploaded', isHost: true },
      { id: '2', name: 'Jamie', status: 'uploaded' },
      { id: '3', name: 'Marco', status: 'uploaded' },
      { id: '4', name: 'Trisha', status: 'uploaded' },
      { id: '5', name: 'Ana', status: 'uploaded' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  '2': {
    id: '2',
    name: 'Study Squad',
    status: 'waiting',
    hostId: 'mock-user-123',
    members: [
      { id: '1', name: 'Raphael', status: 'uploaded', isHost: true },
      { id: '6', name: 'Kevin', status: 'pending' },
      { id: '7', name: 'Sarah', status: 'pending' },
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
