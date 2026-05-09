export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          host_id: string
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          host_id: string
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          host_id: string
          status?: string
        }
      }
      members: {
        Row: {
          id: string
          room_id: string
          user_id: string
          status: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          status?: string
        }
        Update: {
          id?: string
          room_id: string
          user_id: string
          status?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
