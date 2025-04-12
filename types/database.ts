export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      clubs: {
        Row: {
          id: number
          name: string
          location: string
          description: string | null
          website: string | null
        }
        Insert: {
          id?: number
          name: string
          location: string
          description?: string | null
          website?: string | null
        }
        Update: {
          id?: number
          name?: string
          location?: string
          description?: string | null
          website?: string | null
        }
      }
      events: {
        Row: {
          id: number
          title: string
          club_id: number
          dj: string
          price: string
          date: string
          description: string | null
          created_at: string
          event_url: string | null
          image_url: string | null
          identifier: string | null
        }
        Insert: {
          id?: number
          title: string
          club_id: number
          dj: string
          price: string
          date: string
          description?: string | null
          created_at?: string
          event_url?: string | null
          image_url?: string | null
          identifier?: string | null
        }
        Update: {
          id?: number
          title?: string
          club_id?: number
          dj?: string
          price?: string
          date?: string
          description?: string | null
          created_at?: string
          event_url?: string | null
          image_url?: string | null
          identifier?: string | null
        }
      }
      tags: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      event_tags: {
        Row: {
          event_id: number
          tag_id: number
        }
        Insert: {
          event_id: number
          tag_id: number
        }
        Update: {
          event_id?: number
          tag_id?: number
        }
      }
    }
  }
}
