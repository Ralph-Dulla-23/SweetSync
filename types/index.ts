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

export interface TimeSlot {
  dayIndex: number;
  hourIndex: number;
  freeCount: number;
  members: string[]; // Free members
  busyMembers: string[]; // Busy members
}

export interface MyBlock {
  id: string;
  title: string;
  dayIndex: number;
  startHour: number;
  endHour: number;
  color?: string;
}

// UI Helpers
export type StatusVariant = 'peach' | 'indigo' | 'mint' | 'neutral' | 'success' | 'pending';
