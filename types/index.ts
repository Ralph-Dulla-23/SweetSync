import { Database } from './database';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Core Entities
export interface Room {
  id: string;
  name: string;
  description?: string;
  sessionStatus: RoomStatus;
  hostId: string;
  members: Member[];
  upcomingEvents?: Event[];
  activitySuggestions?: ActivitySuggestion[];
  createdAt: string;
  updatedAt: string;
}

export type RoomStatus = 'collecting' | 'processing' | 'voting_slots' | 'voting_activity' | 'confirmed' | 'expired';

export interface Event {
  id: string;
  roomId: string;
  title: string;
  description?: string;
  date: string;
  startSlot: number;
  endSlot: number;
  members: string[]; // Member IDs
  location?: string;
  category?: 'social' | 'study' | 'food' | 'active';
}

export interface ActivitySuggestion {
  id: string;
  title: string;
  description: string;
  duration: number; // in slots (30m each)
  category: 'social' | 'study' | 'food' | 'active';
  votes?: number;
}

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
