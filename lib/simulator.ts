import { Room, Member, TimeSlot, MyBlock, Preference, RoomStatus } from '@/types';
import { getWeekDays } from './time';

// --- Types for the Simulator ---

type Listener = () => void;

interface SimulatorState {
  rooms: Map<string, Room>;
  schedules: Map<string, Map<string, Preference>>; // userId -> (date-slot -> preference)
  currentUser: Member;
}

// --- Initial Mock Data ---

const INITIAL_USER: Member = {
  id: 'me',
  name: 'You',
  status: 'pending',
  isHost: true,
};

const MOCK_FRIENDS: Member[] = [
  { id: '1', name: 'Raphael', status: 'uploaded' },
  { id: '2', name: 'Jamie', status: 'uploaded' },
  { id: '3', name: 'Marco', status: 'uploaded' },
  { id: '4', name: 'Trisha', status: 'uploaded' },
  { id: '5', name: 'Ana', status: 'uploaded' },
];

// --- The Simulator Store ---

class SimulatorStore {
  private state: SimulatorState = {
    rooms: new Map(),
    schedules: new Map(),
    currentUser: INITIAL_USER,
  };

  private listeners: Set<Listener> = new Set();
  private activeTimers: Set<NodeJS.Timeout> = new Set();

  constructor() {
    this.setupInitialState();
  }

  private setupInitialState() {
    // Create a default room for the demo
    const roomId = '1';
    const room: Room = {
      id: roomId,
      name: 'Friday Gang',
      description: 'Coordinate with the squad',
      sessionStatus: 'collecting',
      hostId: 'me',
      members: [INITIAL_USER, ...MOCK_FRIENDS.slice(0, 4)],
      expectedCount: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.rooms.set(roomId, room);

    // Setup mock schedules for friends
    MOCK_FRIENDS.forEach(friend => {
      const schedule = new Map<string, Preference>();
      const weekDays = getWeekDays();
      weekDays.forEach((date, dayIndex) => {
        // Create a "Magic Corridor" on Friday (day 4) evening
        const isFriday = dayIndex === 4;
        
        for (let s = 0; s < 48; s++) {
          if (isFriday && s >= 36 && s <= 42) {
            // Everyone is free Friday 6 PM - 9 PM, most prefer it
            schedule.set(`${date}-${s}`, Math.random() > 0.2 ? 2 : 1);
            continue;
          }

          // Randomly assign preferences for other times
          if (Math.random() > 0.75) {
            schedule.set(`${date}-${s}`, Math.random() > 0.4 ? 1 : 2);
          }
        }
      });
      this.state.schedules.set(friend.id, schedule);
    });
  }

  // --- Subscription ---

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // --- Actions ---

  getRoom(id: string): Room | undefined {
    return this.state.rooms.get(id);
  }

  getRooms(): Room[] {
    return Array.from(this.state.rooms.values());
  }

  createRoom(name: string, description?: string, expectedCount: number = 2): Room {
    const id = Math.random().toString(36).substr(2, 9);
    const newRoom: Room = {
      id,
      name,
      description,
      sessionStatus: 'collecting',
      hostId: 'me',
      members: [this.state.currentUser],
      expectedCount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.rooms.set(id, newRoom);
    this.notify();
    return newRoom;
  }

  updateRoomStatus(roomId: string, status: RoomStatus) {
    const room = this.state.rooms.get(roomId);
    if (room) {
      room.sessionStatus = status;
      room.updatedAt = new Date().toISOString();
      this.notify();
    }
  }

  addMemberToRoom(roomId: string, member: Member) {
    const room = this.state.rooms.get(roomId);
    if (room) {
      room.members.push(member);
      this.notify();
    }
  }

  updateMemberStatus(roomId: string, userId: string, status: Member['status']) {
    const room = this.state.rooms.get(roomId);
    if (room) {
      room.members = room.members.map(m => m.id === userId ? { ...m, status } : m);
      this.notify();
    }
  }

  getSchedule(userId: string): Map<string, Preference> {
    return this.state.schedules.get(userId) || new Map();
  }

  updateMySchedule(date: string, slotIndex: number, preference: Preference) {
    this.updateMySchedules([{ date, slotIndex, preference }]);
  }

  updateMySchedules(updates: { date: string, slotIndex: number, preference: Preference }[]) {
    const myId = 'me';
    let schedule = this.state.schedules.get(myId);
    if (!schedule) {
      schedule = new Map();
      this.state.schedules.set(myId, schedule);
    }

    updates.forEach(({ date, slotIndex, preference }) => {
      const key = `${date}-${slotIndex}`;
      if (preference === 0) {
        schedule!.delete(key);
      } else {
        schedule!.set(key, preference);
      }
    });

    this.notify();
  }

  // --- Helper: Calculate Heatmap Data ---

  getHeatMapData(roomId: string): TimeSlot[][] {
    const room = this.state.rooms.get(roomId);
    if (!room) return [];

    const weekDays = getWeekDays();
    const data: TimeSlot[][] = [];

    weekDays.forEach(date => {
      const dayData: TimeSlot[] = [];
      for (let s = 0; s < 48; s++) {
        const freeMembers: string[] = [];
        const preferredMembers: string[] = [];
        const busyMembers: string[] = [];

        room.members.forEach(member => {
          const schedule = this.getSchedule(member.id);
          const pref = schedule.get(`${date}-${s}`) || 0;
          
          if (pref === 1) {
            freeMembers.push(member.name);
          } else if (pref === 2) {
            freeMembers.push(member.name);
            preferredMembers.push(member.name);
          } else {
            busyMembers.push(member.name);
          }
        });

        dayData.push({
          date,
          slotIndex: s,
          freeCount: freeMembers.length,
          preferredCount: preferredMembers.length,
          members: freeMembers,
          preferredMembers: preferredMembers,
          busyMembers: busyMembers,
        });
      }
      data.push(dayData);
    });

    return data;
  }

  // --- Simulation Logic ---

  startSimulation(roomId: string) {
    const room = this.state.rooms.get(roomId);
    if (!room) return;

    // Simulate friends joining and syncing one by one
    MOCK_FRIENDS.forEach((friend, index) => {
      const joinTimeout = setTimeout(() => {
        this.activeTimers.delete(joinTimeout);
        // 1. Join
        const currentRoom = this.state.rooms.get(roomId);
        if (currentRoom && !currentRoom.members.find(m => m.id === friend.id)) {
          this.addMemberToRoom(roomId, { ...friend, status: 'pending' });
        }

        // 2. Sync after a few more seconds
        const syncTimeout = setTimeout(() => {
          this.activeTimers.delete(syncTimeout);
          this.updateMemberStatus(roomId, friend.id, 'uploaded');
        }, 2000);
        this.activeTimers.add(syncTimeout);
      }, (index + 1) * 3000);
      this.activeTimers.add(joinTimeout);
    });
  }

  stopSimulation() {
    this.activeTimers.forEach(timer => clearTimeout(timer));
    this.activeTimers.clear();
  }

  getRecommendedSlots(roomId: string): any[] {
    const room = this.state.rooms.get(roomId);
    if (!room) return [];

    const weekDays = getWeekDays();
    const allSlots: any[] = [];

    weekDays.forEach(date => {
      for (let s = 14; s < 46; s++) { // 7 AM to 11 PM
        const freeMembers: string[] = [];
        const preferredMembers: string[] = [];
        
        room.members.forEach(member => {
          const schedule = this.getSchedule(member.id);
          const pref = schedule.get(`${date}-${s}`) || 0;
          if (pref >= 1) freeMembers.push(member.name);
          if (pref === 2) preferredMembers.push(member.name);
        });

        if (freeMembers.length > 0) {
          allSlots.push({
            id: `${date}-${s}`,
            date,
            slotIndex: s,
            durationSlots: 4, // 2 hours
            freeCount: freeMembers.length,
            totalCount: room.members.length,
            preferredCount: preferredMembers.length,
          });
        }
      }
    });

    // Sort by freeCount (desc), then preferredCount (desc)
    return allSlots
      .sort((a, b) => (b.freeCount - a.freeCount) || (b.preferredCount - a.preferredCount))
      .slice(0, 3);
  }
}

export const simulator = new SimulatorStore();
