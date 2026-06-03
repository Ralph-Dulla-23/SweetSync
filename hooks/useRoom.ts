import { useState, useCallback, useEffect } from 'react';
import { Room, Member } from '@/types';
import { simulator } from '@/lib/simulator';
import { useSweetToast } from './useSweetToast';

export function useRoom(roomId: string) {
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const toast = useSweetToast();

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
    return () => {
      unsubscribe();
      simulator.stopSimulation();
    };
  }, [fetchRoomDetails]);

  const updateMemberStatus = useCallback((userId: string, status: Member['status']) => {
    simulator.updateMemberStatus(roomId, userId, status);
  }, [roomId]);

  const nudgeMember = useCallback((userId: string) => {
    try {
      // Simulated behavior: nudged member uploads after 2 seconds
      const timeoutId = setTimeout(() => {
        simulator.updateMemberStatus(roomId, userId, 'uploaded');
      }, 2000);
      
      toast.show({
        type: 'success',
        text1: 'Squad nudged! 🍑',
        text2: 'Waiting for them to sync their calendar.'
      });

      return () => clearTimeout(timeoutId);
    } catch (error) {
      toast.show({
        type: 'error',
        text1: 'Sync failed',
        text2: 'Couldn\'t reach the squad. Try again?'
      });
    }
  }, [roomId, toast]);

  const createRoom = useCallback((name: string, description?: string, expectedCount: number = 2) => {
    return simulator.createRoom(name, description, expectedCount);
  }, []);

  const updateStatus = useCallback((status: Room['sessionStatus']) => {
    simulator.updateRoomStatus(roomId, status);
  }, [roomId]);

  const startSimulation = useCallback(() => {
    try {
      simulator.startSimulation(roomId);
      toast.show({
        type: 'info',
        text1: 'Prototype Mode Active 🪄',
        text2: 'Simulating the squad joining & syncing...'
      });
    } catch (error) {
      toast.show({
        type: 'error',
        text1: 'Simulation error',
        text2: 'Could not start prototype sequence.'
      });
    }
  }, [roomId, toast]);

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
    return () => {
      unsubscribe();
    };
  }, [fetchRooms]);

  return {
    rooms,
    loading,
    refresh: fetchRooms,
  };
}
