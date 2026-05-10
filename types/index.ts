import { Database } from './database';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Core Entities
export interface Room {
  id: string;
  name: string;
  description?: string;
  status: RoomStatus;
  hostId: string;
  members: Member[];
  createdAt: string;
  updatedAt: string;
}

export type RoomStatus = 'voting' | 'waiting' | 'confirmed';

export interface Member {
  id: string;
  name: string;
  email?: string;
  avatarUri?: string;
  status: MemberStatus;
  isHost?: boolean;
}

export type MemberStatus = 'uploaded' | 'pending';

export type Preference = 0 | 1 | 2;

export interface TimeSlot {
  date: string; // ISO 8601 (YYYY-MM-DD)
  slotIndex: number; // 0-47 (30m increments)
  freeCount: number;
  preferredCount: number;
  members: string[]; // Free members
  preferredMembers: string[]; // Preferred members
  busyMembers: string[]; // Busy members
}

export interface MyBlock {
  id: string;
  title: string;
  date: string; // ISO 8601 (YYYY-MM-DD)
  startSlot: number;
  endSlot: number;
  preference: Preference;
  color?: string;
}

export interface GlobalBlock extends MyBlock {
  sourceType: 'personal' | 'room';
  roomId?: string;
  roomName?: string;
}

// UI Helpers
export type StatusVariant = 'peach' | 'indigo' | 'mint' | 'neutral' | 'success' | 'pending';
