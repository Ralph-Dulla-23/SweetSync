import { useState, useCallback, useEffect } from 'react';
import { Room, Member } from '@/types';
import { simulator } from '@/lib/simulator';
import { useToast } from '@/components/Toast';

export function useRoom(roomId: string) {
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const { showToast } = useToast();

  const fetchRoomDetails = useCallback(() => {
    const data = simulator.getRoom(roomId);
    setRoom(data || null);
  }, [roomId]);

  useEffect(() => {
    fetchRoomDetails();
    // Subscribe to simulator changes
    const unsubscribe = simulator.subscribe(() => {
      fetchRoomDetails();
    });
    return unsubscribe;
  }, [fetchRoomDetails]);

  const updateMemberStatus = useCallback(async (userId: string, status: Member['status']) => {
    try {
      simulator.updateMemberStatus(roomId, userId, status);
      showToast({ type: 'success', message: 'Status updated successfully' });
    } catch (error) {
      showToast({ type: 'error', message: 'Failed to update status' });
    }
  }, [roomId, showToast]);

  const nudgeMember = useCallback(async (userId: string) => {
    // Placeholder for notification trigger
    console.log(`Nudging member ${userId}...`);
    showToast({ type: 'info', message: 'Nudge sent' });
    // Simulated behavior: nudged member uploads after 2 seconds
    setTimeout(() => {
      simulator.updateMemberStatus(roomId, userId, 'uploaded');
    }, 2000);
  }, [roomId, showToast]);

  const createRoom = useCallback((name: string, description?: string) => {
    return simulator.createRoom(name, description);
  }, []);

  const updateStatus = useCallback((status: Room['sessionStatus']) => {
    simulator.updateRoomStatus(roomId, status);
  }, [roomId]);

  const startSimulation = useCallback(() => {
    simulator.startSimulation(roomId);
  }, [roomId]);

  return {
    room,
    loading,
    refresh: fetchRoomDetails,
    updateMemberStatus,
    nudgeMember,
    createRoom,
    updateStatus,
    startSimulation,
  };
}

export function useRooms() {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchRooms = useCallback(() => {
    const data = simulator.getRooms();
    setRooms(data);
  }, []);

  useEffect(() => {
    fetchRooms();
    const unsubscribe = simulator.subscribe(() => {
      fetchRooms();
    });
    return unsubscribe;
  }, [fetchRooms]);

  return {
    rooms,
    loading,
    refresh: fetchRooms,
  };
}
